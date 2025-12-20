'use client';

import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BarChart } from '@/components/charts/BarChart';
import { Badge } from '@/components/ui/badge';
import { useNetworkStore } from '@/stores/networkStore';
import { formatNumber } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
function computeCredits(node: any) {
  const uptimeHours = node.uptime / 3600;
  const penalty = node.status === 'offline' ? 100 : 0;
  return Math.max(0, Math.floor(uptimeHours - penalty));
}

function bucketize(values: number[], buckets = 6) {
  if (values.length === 0) return [];

  const sorted = [...values].sort((a, b) => a - b);
  const size = Math.ceil(sorted.length / buckets);

  return Array.from({ length: buckets }, (_, i) => {
    const slice = sorted.slice(i * size, (i + 1) * size);
    if (slice.length === 0) return null;

    return {
      label: `${formatNumber(slice[0])}–${formatNumber(slice[slice.length - 1])}`,
      count: slice.length,
      avg: slice.reduce((a, b) => a + b, 0) / slice.length,
    };
  }).filter(Boolean) as {
    label: string;
    count: number;
    avg: number;
  }[];
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function CreditDistribution() {
  const { nodes } = useNetworkStore();

  /* Loading */
  if (!nodes) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[240px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (nodes.length === 0) {
    return (
      <Card className="flex h-[320px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Credit distribution will appear once nodes are active.
        </p>
      </Card>
    );
  }

  /* Derive credits */
  const credits = nodes.map(computeCredits);

  const totalCredits = credits.reduce((a, b) => a + b, 0);
  const avgCredits = totalCredits / credits.length;
  const sorted = [...credits].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const top10 = sorted.slice(Math.floor(sorted.length * 0.9));

  const buckets = bucketize(credits);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Award className="h-4 w-4" />
            Credit Distribution
          </div>
          <p className="text-xs text-muted-foreground">
            Network credit concentration · derived from uptime
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Average</p>
          <p className="text-2xl font-semibold tracking-tight">
            {formatNumber(avgCredits)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Distribution chart */}
        <BarChart
          data={buckets.map((b) => ({
            range: b.label,
            nodes: b.count,
          }))}
          bars={[
            {
              dataKey: 'nodes',
              name: 'Nodes',
              color: 'hsl(var(--primary))',
            },
          ]}
          xAxisKey="range"
          height={240}
          showLegend={false}
        />

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 border-t pt-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Median</p>
            <p className="font-medium">{formatNumber(median)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Top 10% Avg</p>
            <p className="font-medium">
              {formatNumber(
                top10.reduce((a, b) => a + b, 0) / top10.length
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Credits</p>
            <p className="font-medium">{formatNumber(totalCredits)}</p>
          </div>
        </div>

        {/* Interpretation */}
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          Credits are derived from observed uptime behavior and recalculated
          continuously. Distribution reflects operational consistency, not
          stake or configuration.
        </div>
      </CardContent>
    </Card>
  );
}
