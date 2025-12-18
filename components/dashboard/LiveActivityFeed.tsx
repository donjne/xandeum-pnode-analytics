'use client';

import * as React from 'react';
import {
  Radio,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  HardDrive,
  Clock,
  Activity,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNetworkStore } from '@/stores/networkStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityEvent {
  id: string;
  type: 'node_online' | 'node_offline' | 'storage_update' | 'version_update';
  message: string;
  timestamp: number;
  pubkey?: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export function LiveActivityFeed() {
  const { nodes, isLoading } = useNetworkStore();
  const [activities, setActivities] = React.useState<ActivityEvent[]>([]);
  const prevNodesRef = React.useRef<typeof nodes>([]);

  /* ---------------------------------------------
     Generate activity events from real changes
  --------------------------------------------- */
  React.useEffect(() => {
    if (isLoading || nodes.length === 0) return;

    const prevNodes = prevNodesRef.current;
    const newActivities: ActivityEvent[] = [];

    if (prevNodes.length === 0) {
      const online = nodes.filter((n) => n.status === 'online').length;
      newActivities.push({
        id: `init-${Date.now()}`,
        type: 'node_online',
        message: `Network initialized with ${online} online nodes`,
        timestamp: Date.now(),
        severity: 'success',
      });
    } else {
      nodes.forEach((node) => {
        const prev = prevNodes.find((n) => n.pubkey === node.pubkey);

        if (!prev) {
          newActivities.push({
            id: `new-${node.pubkey}`,
            type: 'node_online',
            message: `New node discovered`,
            timestamp: Date.now(),
            pubkey: node.pubkey,
            severity: 'success',
          });
          return;
        }

        if (prev.status !== node.status) {
          newActivities.push({
            id: `status-${node.pubkey}`,
            type: node.status === 'online' ? 'node_online' : 'node_offline',
            message: `Node went ${node.status}`,
            timestamp: Date.now(),
            pubkey: node.pubkey,
            severity: node.status === 'online' ? 'success' : 'warning',
          });
        }

        const storageDiff = Math.abs(
          node.storage_usage_percent - prev.storage_usage_percent
        );
        if (storageDiff > 5) {
          newActivities.push({
            id: `storage-${node.pubkey}`,
            type: 'storage_update',
            message: `Storage usage ${
              node.storage_usage_percent > prev.storage_usage_percent
                ? 'increased'
                : 'decreased'
            } to ${node.storage_usage_percent.toFixed(1)}%`,
            timestamp: Date.now(),
            pubkey: node.pubkey,
            severity:
              node.storage_usage_percent > 85 ? 'warning' : 'info',
          });
        }

        if (prev.version !== node.version) {
          newActivities.push({
            id: `version-${node.pubkey}`,
            type: 'version_update',
            message: `Updated to v${node.version}`,
            timestamp: Date.now(),
            pubkey: node.pubkey,
            severity: 'info',
          });
        }
      });
    }

    if (newActivities.length) {
      setActivities((prev) =>
        [...newActivities, ...prev].slice(0, 50)
      );
    }

    prevNodesRef.current = nodes;
  }, [nodes, isLoading]);

  /* ---------------------------------------------
     Icon + color only (NO backgrounds)
  --------------------------------------------- */
  const iconMap = {
    node_online: CheckCircle2,
    node_offline: AlertCircle,
    storage_update: HardDrive,
    version_update: TrendingUp,
  };

  const severityColor = {
    success: 'text-emerald-500',
    info: 'text-blue-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
  };

  if (isLoading) {
    return (
      <Card
        className={cn(
          'rounded-2xl border border-transparent',
          'bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]',
          'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
          'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
        )}
      >
        <CardHeader>
          <CardTitle>Live Activity Feed</CardTitle>
          <CardDescription>Loading network events…</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'relative rounded-2xl border border-transparent',
        'bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]',
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-cyan-500" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>Real-time network events</CardDescription>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-cyan-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
            </span>
            Live
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-white/60">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-40" />
            Waiting for network activity…
          </div>
        ) : (
          <ScrollArea className="h-[420px] pr-2">
            <ul className="space-y-1">
              {activities.map((a) => {
                const Icon = iconMap[a.type] ?? Activity;
                return (
                  <li
                    key={a.id}
                    className="group flex gap-4 rounded-xl px-3 py-3 transition hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Icon
                      className={cn(
                        'mt-0.5 h-4 w-4 shrink-0',
                        severityColor[a.severity]
                      )}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-white/90">
                        {a.message}
                      </div>

                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-white/50">
                        {a.pubkey && (
                          <>
                            <span className="font-mono truncate max-w-[140px]">
                              {a.pubkey.slice(0, 8)}…
                              {a.pubkey.slice(-4)}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span>
                          {formatDistanceToNow(a.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
