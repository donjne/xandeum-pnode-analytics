'use client';

import * as React from 'react';
import { Trophy, Medal, Award, TrendingUp, CircleDot } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNetworkStore } from '@/stores/networkStore';
import { cn } from '@/lib/utils';

export function TopPerformers() {
  const { nodes, isLoading } = useNetworkStore();

  const rankedNodes = React.useMemo(() => {
    return nodes
      .filter((node) => node.status === 'online')
      .map((node) => {
        let score = 0;

        // Uptime (0–35)
        const uptimeHours = node.uptime / 3600;
        score += Math.min((uptimeHours / 720) * 35, 35);

        // Storage health (0–25)
        const storageUsage = node.storage_usage_percent;
        score += storageUsage < 70 ? 25 : storageUsage < 85 ? 15 : 5;

        // Recency (0–20)
        const lastSeenMinutes =
          (Date.now() / 1000 - node.last_seen_timestamp) / 60;
        score +=
          lastSeenMinutes < 1
            ? 20
            : lastSeenMinutes < 5
            ? 15
            : lastSeenMinutes < 15
            ? 10
            : 5;

        // Version bonus (0–10)
        score += 10;

        // Commitment (0–10)
        const storageGB = node.storage_committed / 1024 ** 3;
        score += Math.min((storageGB / 100) * 10, 10);

        return {
          ...node,
          healthScore: Math.round(score),
        };
      })
      .sort((a, b) => {
        if (b.healthScore !== a.healthScore) {
          return b.healthScore - a.healthScore;
        }
        return b.uptime - a.uptime; // tie-breaker
      })
      .slice(0, 10);
  }, [nodes]);

  const medalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />;
    return <Award className="h-5 w-5 text-blue-400" />;
  };

  const rowAccent = (rank: number) => {
    if (rank === 1) return 'from-yellow-400/20 to-orange-400/20';
    if (rank === 2) return 'from-slate-300/20 to-slate-400/20';
    if (rank === 3) return 'from-orange-400/20 to-red-400/20';
    return 'from-blue-400/15 to-purple-400/15';
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl bg-white shadow dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Loading rankings…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-slate-100 animate-pulse dark:bg-white/5"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (rankedNodes.length === 0) {
    return (
      <Card className="rounded-2xl bg-white shadow dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Performers
          </CardTitle>
          <CardDescription>No online nodes to rank</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-slate-500 dark:text-slate-400">
          Waiting for network activity…
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-2xl border border-transparent',
        // light mode
        'bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]',
        // dark mode separation (no white border)
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            Top {rankedNodes.length} Performers
          </CardTitle>
        </div>

        <Badge
          variant="outline"
          className="bg-slate-100 text-slate-700 border-transparent dark:bg-white/10 dark:text-white"
        >
          <CircleDot className="mr-1 h-3 w-3" />
          Live
        </Badge>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[420px] pr-3">
          <div className="space-y-2">
            {rankedNodes.map((node, index) => {
              const rank = index + 1;

              return (
                <div
                  key={node.pubkey}
                  className={cn(
                    'group relative flex items-center gap-4 rounded-xl p-4',
                    'bg-slate-50 dark:bg-white/5',
                    'transition-all duration-300',
                    'hover:-translate-y-0.5 hover:shadow-lg',
                    'dark:hover:shadow-black/30'
                  )}
                >
                  {/* Accent strip */}
                  <div
                    className={cn(
                      'absolute inset-y-0 left-0 w-1 rounded-full bg-gradient-to-b',
                      rowAccent(rank)
                    )}
                  />

                  {/* Rank */}
                  <div className="flex w-10 flex-col items-center">
                    {medalIcon(rank)}
                    <span className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      #{rank}
                    </span>
                  </div>

                  {/* Node info */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-sm font-medium text-slate-900 dark:text-white">
                      {node.pubkey.slice(0, 8)}…{node.pubkey.slice(-6)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      v{node.version} • {(node.uptime / 3600).toFixed(0)}h uptime •{' '}
                      {node.storage_usage_percent.toFixed(1)}% used
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div
                      className={cn(
                        'text-2xl font-semibold bg-clip-text text-transparent',
                        rank === 1
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                          : rank === 2
                          ? 'bg-gradient-to-r from-slate-300 to-slate-400'
                          : rank === 3
                          ? 'bg-gradient-to-r from-orange-400 to-red-400'
                          : 'bg-gradient-to-r from-blue-400 to-purple-400'
                      )}
                    >
                      {node.healthScore}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      score
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
