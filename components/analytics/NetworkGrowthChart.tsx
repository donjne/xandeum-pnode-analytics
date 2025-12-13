'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/AreaChart';
import { useNetworkStore } from '@/stores/networkStore';

// Mock data generator
const generateGrowthData = () => {
  const now = Date.now();
  return Array.from({ length: 30 }, (_, i) => ({
    day: new Date(now - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    total: Math.floor(100 + i * 3 + Math.random() * 10),
    online: Math.floor(90 + i * 2.5 + Math.random() * 8),
    offline: Math.floor(10 + i * 0.5 + Math.random() * 2),
  }));
};

export function NetworkGrowthChart() {
  const { totalCount } = useNetworkStore();
  const [data] = React.useState(generateGrowthData);

  const currentTotal = data[data.length - 1].total;
  const previousTotal = data[data.length - 8].total; // 7 days ago
  const growthPercent = ((currentTotal - previousTotal) / previousTotal) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Network Growth
            </CardTitle>
            <CardDescription>30-day pNode count history</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{currentTotal}</p>
            <p className="text-xs text-muted-foreground">
              <span className={growthPercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                {growthPercent >= 0 ? '↑' : '↓'} {Math.abs(growthPercent).toFixed(1)}%
              </span>{' '}
              vs 7d ago
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AreaChart
          data={data}
          areas={[
            {
              dataKey: 'total',
              name: 'Total Nodes',
              color: 'hsl(var(--primary))',
              stackId: '1',
            },
          ]}
          xAxisKey="day"
          height={300}
          showLegend={false}
          useGradient={true}
        />

        {/* Additional metrics */}
        <div className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Average Daily Growth</p>
            <p className="text-lg font-bold">
              +{((currentTotal - data[0].total) / 30).toFixed(1)} nodes
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Peak Nodes</p>
            <p className="text-lg font-bold">{Math.max(...data.map((d) => d.total))}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">30-Day Growth</p>
            <p className="text-lg font-bold">
              +{currentTotal - data[0].total} ({(((currentTotal - data[0].total) / data[0].total) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}