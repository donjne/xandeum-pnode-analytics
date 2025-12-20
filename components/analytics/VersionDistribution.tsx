'use client';

import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PieChart } from '@/components/charts/PieChart';
import { useNetworkStore } from '@/stores/networkStore';
import { formatPercentage } from '@/lib/utils';

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#22c55e', // green
];

function truncateVersion(v: string, max = 18) {
  return v.length > max ? `${v.slice(0, max)}…` : v;
}

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
        raw: version,
        name: truncateVersion(version),
        value: count,
        percentage: (count / total) * 100,
        color: COLORS[i % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  })();

  const mostUsed = data[0];

  return (
    <Card>
      <CardHeader className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Package className="h-4 w-4" />
            Version Distribution
          </div>
          <p className="text-xs text-muted-foreground">
            Active software versions across the network
          </p>
        </div>

        {mostUsed && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Most Adopted</p>
            <p className="text-sm font-medium">{mostUsed.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(mostUsed.percentage, 1)}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-xl bg-muted/50 ring-1 ring-inset ring-border p-4">
          <PieChart
            data={data}
            height={260}
            innerRadius={70}
            outerRadius={110}
            showLegend={false}
          />
        </div>

        <div className="space-y-2">
          {data.map((v) => (
            <div
              key={v.raw}
              className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-muted/40"
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
