'use client';

import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PieChart } from '@/components/charts/PieChart';
import { useNetworkStore } from '@/stores/networkStore';
import { formatPercentage } from '@/lib/utils';

const COLORS = [
  'hsl(var(--primary))',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
];

export function VersionDistribution() {
  const { nodes } = useNetworkStore();

  const data = (() => {
    const map = new Map<string, number>();
    nodes.forEach((n) =>
      map.set(n.version, (map.get(n.version) || 0) + 1)
    );

    const total = nodes.length || 1;

    return Array.from(map.entries())
      .map(([version, count], i) => ({
        name: `v${version}`,
        value: count,
        percentage: (count / total) * 100,
        color: COLORS[i % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  })();

  const latest = data[0];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Package className="h-4 w-4" />
            Version Distribution
          </div>
          <p className="text-xs text-muted-foreground">
            Active software versions across the network
          </p>
        </div>

        {latest && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Most Adopted</p>
            <p className="text-lg font-semibold">{latest.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(latest.percentage, 1)} of nodes
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <PieChart
          data={data}
          height={260}
          innerRadius={70}
          outerRadius={110}
          showLegend={false}
        />

        <div className="space-y-2 border-t pt-4">
          {data.map((v) => (
            <div
              key={v.name}
              className="flex items-center justify-between rounded-md px-2 py-1 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: v.color }}
                />
                <span className="font-medium">{v.name}</span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <span>{v.value} nodes</span>
                <span>{formatPercentage(v.percentage, 1)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
