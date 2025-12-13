import * as React from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNetworkStore } from '@/stores/networkStore';
import { calculateHealthScore, formatPubkey, formatBytes } from '@/lib/utils';
import { TruncatedText } from '@/components/shared/TruncatedText';
import { Skeleton } from '@/components/ui/skeleton';

export function TopPerformers() {
  const { nodes, isLoading: loading } = useNetworkStore();

  const topNodes = React.useMemo(() => {
    return [...nodes]
      .map((node) => ({
        ...node,
        score: calculateHealthScore(node),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [nodes]);

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (index === 1) return <Award className="h-4 w-4 text-gray-400" />;
    if (index === 2) return <Award className="h-4 w-4 text-orange-600" />;
    return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Highest scoring pNodes by health metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (topNodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Highest scoring pNodes by health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">No nodes available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>Highest scoring pNodes by health metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {topNodes.map((node, index) => (
          <div
            key={node.pubkey}
            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center">
                {getMedalIcon(index)}
              </div>
              <div className="space-y-1">
                <TruncatedText text={node.pubkey} maxLength={6} showCopy={false} />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatBytes(node.storage_committed)}</span>
                  <span>•</span>
                  <span>v{node.version}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  node.score >= 90
                    ? 'success'
                    : node.score >= 75
                      ? 'default'
                      : node.score >= 60
                        ? 'warning'
                        : 'destructive'
                }
              >
                {node.score}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}