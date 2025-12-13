import * as React from 'react';
import { HardDrive, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts/LineChart';
import { Progress } from '@/components/ui/progress';
import { useNetworkStore } from '@/stores/networkStore';
import { formatBytes, formatPercentage } from '@/lib/utils';

// Mock historical data generator
const generateStorageHistory = () => {
  const now = Date.now();
  return Array.from({ length: 7 }, (_, i) => ({
    day: new Date(now - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    committed: 800 + i * 50 + Math.random() * 20,
    used: 500 + i * 35 + Math.random() * 15,
    utilization: ((500 + i * 35) / (800 + i * 50)) * 100,
  }));
};

export function StorageAnalysis() {
  const { totalStorage, usedStorage } = useNetworkStore();
  const [historyData] = React.useState(generateStorageHistory);

  const utilizationPercent = (usedStorage / totalStorage) * 100;
  const currentUtil = historyData[historyData.length - 1].utilization;
  const previousUtil = historyData[historyData.length - 2].utilization;
  const utilTrend = currentUtil - previousUtil;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Analysis
            </CardTitle>
            <CardDescription>Network storage capacity and utilization</CardDescription>
          </div>
          <div className="space-y-1 text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Current Utilization</p>
            <p className="text-2xl font-bold">{formatPercentage(utilizationPercent, 1)}</p>
            <div className="flex items-center gap-1 text-xs">
              {utilTrend >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">+{utilTrend.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">{utilTrend.toFixed(1)}%</span>
                </>
              )}
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Storage overview - responsive grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Total Committed</p>
            <p className="text-xl font-bold">{formatBytes(totalStorage)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Currently Used</p>
            <p className="text-xl font-bold">{formatBytes(usedStorage)}</p>
          </div>
          <div className="rounded-lg border p-3 sm:col-span-2 lg:col-span-1">
            <p className="text-xs text-muted-foreground">Available Space</p>
            <p className="text-xl font-bold">{formatBytes(totalStorage - usedStorage)}</p>
          </div>
        </div>

        {/* Utilization bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Storage Utilization</span>
            <span className="text-muted-foreground">{formatPercentage(utilizationPercent, 2)}</span>
          </div>
          <Progress value={utilizationPercent} className="h-2" />
        </div>

        {/* 7-day trend chart */}
        <LineChart
          data={historyData}
          lines={[
            {
              dataKey: 'committed',
              name: 'Committed',
              color: 'hsl(var(--primary))',
              strokeWidth: 2,
            },
            {
              dataKey: 'used',
              name: 'Used',
              color: '#10b981',
              strokeWidth: 2,
            },
          ]}
          xAxisKey="day"
          yAxisFormatter={(value) => `${value}GB`}
          tooltipFormatter={(value) => `${value.toFixed(1)} GB`}
          height={200}
          showLegend={true}
          showGrid={true}
        />

        {/* Storage distribution - responsive grid */}
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm font-medium">Storage Distribution</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-sm text-muted-foreground">Avg per pNode</span>
              <span className="text-sm font-medium">{formatBytes(totalStorage / 100)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-sm text-muted-foreground">Largest pNode</span>
              <span className="text-sm font-medium">{formatBytes(10737418240)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-sm text-muted-foreground">Smallest pNode</span>
              <span className="text-sm font-medium">{formatBytes(5368709120)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-sm text-muted-foreground">Growth Rate</span>
              <span className="text-sm font-medium">+2.3 GB/day</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}