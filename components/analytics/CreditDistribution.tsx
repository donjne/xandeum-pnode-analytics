import * as React from 'react';
import { Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/charts/BarChart';
import { Badge } from '@/components/ui/badge';
import { useNetworkStore } from '@/stores/networkStore';
import { formatNumber } from '@/lib/utils';

// Mock credit distribution data
const generateCreditDistribution = () => {
  return [
    { range: '0-1K', count: 15, avgCredits: 500, color: '#ef4444' },
    { range: '1K-5K', count: 45, avgCredits: 3000, color: '#f59e0b' },
    { range: '5K-10K', count: 80, avgCredits: 7500, color: '#10b981' },
    { range: '10K-50K', count: 120, avgCredits: 25000, color: '#3b82f6' },
    { range: '50K-100K', count: 60, avgCredits: 75000, color: '#8b5cf6' },
    { range: '100K+', count: 30, avgCredits: 150000, color: '#ec4899' },
  ];
};

const getPerformanceTier = (credits: number) => {
  if (credits >= 100000) return { label: 'Elite', color: 'bg-purple-500' };
  if (credits >= 50000) return { label: 'Advanced', color: 'bg-blue-500' };
  if (credits >= 10000) return { label: 'Intermediate', color: 'bg-green-500' };
  if (credits >= 5000) return { label: 'Basic', color: 'bg-yellow-500' };
  return { label: 'Beginner', color: 'bg-red-500' };
};

export function CreditDistribution() {
  const { nodes } = useNetworkStore();
  const [distributionData] = React.useState(generateCreditDistribution);

  const totalCredits = distributionData.reduce((sum, d) => sum + d.count * d.avgCredits, 0);
  const avgCreditsPerNode = totalCredits / nodes.length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Credit Distribution
            </CardTitle>
            <CardDescription>pNode credit scores and performance tiers</CardDescription>
          </div>
          <div className="space-y-1 text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Network Average</p>
            <p className="text-2xl font-bold">{formatNumber(avgCreditsPerNode)}</p>
            <p className="text-xs text-muted-foreground">credits per node</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credit distribution bar chart */}
        <BarChart
          data={distributionData.map((d) => ({
            range: d.range,
            nodes: d.count,
            credits: d.avgCredits,
          }))}
          bars={[
            {
              dataKey: 'nodes',
              name: 'Node Count',
              color: 'hsl(var(--primary))',
            },
          ]}
          xAxisKey="range"
          yAxisFormatter={(value) => `${value}`}
          tooltipFormatter={(value, name) => `${value} nodes`}
          height={250}
          showLegend={false}
        />

        {/* Performance tiers - responsive grid */}
        <div className="space-y-3 border-t pt-4">
          <p className="text-sm font-medium">Performance Tiers</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {distributionData.map((tier) => {
              const performanceTier = getPerformanceTier(tier.avgCredits);
              return (
                <div
                  key={tier.range}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${performanceTier.color}`}
                      />
                      <span className="text-sm font-medium">{tier.range} credits</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tier.count} nodes • Avg {formatNumber(tier.avgCredits)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {performanceTier.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary stats - responsive grid */}
        <div className="grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Credits</p>
            <p className="text-lg font-bold">{formatNumber(totalCredits)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Median Credits</p>
            <p className="text-lg font-bold">{formatNumber(25000)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Top 10%</p>
            <p className="text-lg font-bold">&gt;{formatNumber(100000)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Monthly Growth</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-lg font-bold text-green-500">+12.3%</p>
            </div>
          </div>
        </div>

        {/* Credit multipliers info - responsive layout */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
          <p className="text-sm font-medium">Boost Multipliers</p>
          <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Deep South Era</span>
              <Badge variant="outline" className="text-purple-500">16x</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Titan NFT</span>
              <Badge variant="outline" className="text-pink-500">11x</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Combined Max</span>
              <Badge variant="outline" className="text-yellow-500">176x</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}