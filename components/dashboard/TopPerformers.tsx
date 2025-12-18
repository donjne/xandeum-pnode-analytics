'use client';

import * as React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNetworkStore } from '@/stores/networkStore';
import { cn } from '@/lib/utils';

export function TopPerformers() {
  const { nodes, isLoading } = useNetworkStore();

  // Calculate health score for each node
  const rankedNodes = React.useMemo(() => {
    return nodes
      .filter(node => node.status === 'online') // Only online nodes
      .map(node => {
        // Calculate health score
        let score = 100;
        
        // Uptime factor (0-35 points)
        const uptimeHours = node.uptime / 3600;
        const uptimeScore = Math.min((uptimeHours / 720) * 35, 35); // 720h (30 days) = max
        score = uptimeScore;
        
        // Storage health (0-25 points)
        const storageUsage = node.storage_usage_percent;
        const storageScore = storageUsage < 70 ? 25 : 
                            storageUsage < 85 ? 15 : 5;
        score += storageScore;
        
        // Recency (0-20 points)
        const lastSeenMinutes = (Date.now() / 1000 - node.last_seen_timestamp) / 60;
        const recencyScore = lastSeenMinutes < 1 ? 20 :
                           lastSeenMinutes < 5 ? 15 :
                           lastSeenMinutes < 15 ? 10 : 5;
        score += recencyScore;
        
        // Version bonus (0-10 points)
        const versionScore = 10; // All get full points for now
        score += versionScore;
        
        // Storage commitment (0-10 points)
        const storageGB = node.storage_committed / (1024 ** 3);
        const commitmentScore = Math.min((storageGB / 100) * 10, 10);
        score += commitmentScore;

        return {
          ...node,
          healthScore: Math.round(score),
        };
      })
      .sort((a, b) => b.healthScore - a.healthScore)
      .slice(0, 10); // Top 10
  }, [nodes]);

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-400" />;
      default:
        return <Award className="h-5 w-5 text-blue-400" />;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/30 to-orange-500/30 border-yellow-500/40';
      case 2:
        return 'from-gray-400/30 to-gray-500/30 border-gray-400/40';
      case 3:
        return 'from-orange-500/30 to-red-500/30 border-orange-500/40';
      default:
        return 'from-blue-500/20 to-purple-500/20 border-blue-500/30';
    }
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Loading top nodes...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 animate-pulse bg-white/5 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (rankedNodes.length === 0) {
    return (
      <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Performers
          </CardTitle>
          <CardDescription>Top nodes by health score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white/60">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No online nodes to rank</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
      {/* Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Top Performers
            </CardTitle>
            <CardDescription>Top {rankedNodes.length} nodes by health score</CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            Live Rankings
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {rankedNodes.map((node, index) => {
              const rank = index + 1;
              return (
                <div
                  key={node.pubkey}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border p-4 transition-all duration-300",
                    "bg-gradient-to-br backdrop-blur-sm",
                    "hover:scale-[1.02] hover:shadow-lg",
                    getRankGradient(rank)
                  )}
                >
                  {/* Rank shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_ease-in-out]" />
                  
                  <div className="relative flex items-center gap-4">
                    {/* Rank & Medal */}
                    <div className="flex flex-col items-center gap-1">
                      {getMedalIcon(rank)}
                      <span className="text-xs font-bold text-white/60">#{rank}</span>
                    </div>

                    {/* Node Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium text-white/90 truncate">
                          {node.pubkey.slice(0, 8)}...{node.pubkey.slice(-6)}
                        </span>
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        >
                          Online
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        <span>v{node.version}</span>
                        <span>•</span>
                        <span>{(node.uptime / 3600).toFixed(0)}h uptime</span>
                        <span>•</span>
                        <span>{node.storage_usage_percent.toFixed(1)}% used</span>
                      </div>
                    </div>

                    {/* Health Score */}
                    <div className="text-right">
                      <div className={cn(
                        "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                        rank === 1 ? "from-yellow-400 to-orange-400" :
                        rank === 2 ? "from-gray-300 to-gray-400" :
                        rank === 3 ? "from-orange-400 to-red-400" :
                        "from-blue-400 to-purple-400"
                      )}>
                        {node.healthScore}
                      </div>
                      <div className="text-xs text-white/50">score</div>
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