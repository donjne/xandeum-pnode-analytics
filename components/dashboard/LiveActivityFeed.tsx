'use client';

import * as React from 'react';
import { Activity, Server, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimeAgo } from '@/components/shared/TimeAgo';
import { formatPubkey } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityEvent {
  id: string;
  type: 'node_online' | 'node_offline' | 'storage_threshold' | 'performance_alert' | 'version_update';
  pubkey: string;
  message: string;
  timestamp: number;
  severity: 'info' | 'warning' | 'error' | 'success';
}

// Mock activity feed - in production, this would come from WebSocket or polling
const generateMockActivities = (): ActivityEvent[] => {
  const now = Math.floor(Date.now() / 1000);
  const mockPubkeys = [
    '7qbRQPVBfxXjJpEa1rnz8JgmKBaUvCpVZPEqoKNh8uHr',
    '2asTHq4vVGazKrmEa3YTXKuYiNZBdv1cQoLc1Tr2kvaw',
    'HhuygLTeS6grue95pKKzak2UPuQMXepWbvQv2ToQfbZN',
  ];

  return [
    {
      id: '1',
      type: 'node_online',
      pubkey: mockPubkeys[0],
      message: 'Node came online',
      timestamp: now - 120,
      severity: 'success',
    },
    {
      id: '2',
      type: 'storage_threshold',
      pubkey: mockPubkeys[1],
      message: 'Storage utilization reached 80%',
      timestamp: now - 300,
      severity: 'warning',
    },
    {
      id: '3',
      type: 'version_update',
      pubkey: mockPubkeys[2],
      message: 'Updated to v0.7.0',
      timestamp: now - 450,
      severity: 'info',
    },
    {
      id: '4',
      type: 'node_offline',
      pubkey: mockPubkeys[0],
      message: 'Node went offline',
      timestamp: now - 600,
      severity: 'error',
    },
    {
      id: '5',
      type: 'performance_alert',
      pubkey: mockPubkeys[1],
      message: 'High response time detected',
      timestamp: now - 900,
      severity: 'warning',
    },
  ];
};

const activityIcons = {
  node_online: CheckCircle,
  node_offline: AlertCircle,
  storage_threshold: TrendingUp,
  performance_alert: Activity,
  version_update: Server,
};

const severityColors = {
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  success: 'text-green-500',
};

export function LiveActivityFeed() {
  const [activities, setActivities] = React.useState<ActivityEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial load
    setTimeout(() => {
      setActivities(generateMockActivities());
      setLoading(false);
    }, 1000);

    // Simulate new activities every 30 seconds
    const interval = setInterval(() => {
      const newActivity: ActivityEvent = {
        id: Date.now().toString(),
        type: ['node_online', 'storage_threshold', 'version_update'][
          Math.floor(Math.random() * 3)
        ] as ActivityEvent['type'],
        pubkey: '7qbRQPVBfxXjJpEa1rnz8JgmKBaUvCpVZPEqoKNh8uHr',
        message: 'New activity detected',
        timestamp: Math.floor(Date.now() / 1000),
        severity: ['info', 'warning', 'success'][Math.floor(Math.random() * 3)] as ActivityEvent['severity'],
      };
      setActivities((prev) => [newActivity, ...prev].slice(0, 10));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Activity</CardTitle>
          <CardDescription>Real-time network events and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live Activity
          <Badge variant="outline" className="ml-auto">
            <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Live
          </Badge>
        </CardTitle>
        <CardDescription>Real-time network events and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${severityColors[activity.severity]}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{formatPubkey(activity.pubkey, 4)}</span>
                      <span>•</span>
                      <TimeAgo timestamp={activity.timestamp} showTooltip={false} />
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      activity.severity === 'error'
                        ? 'border-red-500/20 bg-red-500/10 text-red-500'
                        : activity.severity === 'warning'
                          ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500'
                          : activity.severity === 'success'
                            ? 'border-green-500/20 bg-green-500/10 text-green-500'
                            : 'border-blue-500/20 bg-blue-500/10 text-blue-500'
                    }
                  >
                    {activity.severity}
                  </Badge>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}