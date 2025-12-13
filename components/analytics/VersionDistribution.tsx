import * as React from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNetworkStore } from '@/stores/networkStore';
import { formatPercentage } from '@/lib/utils';

const VERSION_COLORS = [
  'hsl(var(--primary))',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
];

export function VersionDistribution() {
  const { nodes } = useNetworkStore();

  const versionData = React.useMemo(() => {
    const versionMap = new Map<string, number>();
    nodes.forEach((node) => {
      versionMap.set(node.version, (versionMap.get(node.version) || 0) + 1);
    });

    const total = nodes.length || 1;
    return Array.from(versionMap.entries())
      .map(([version, count], index) => ({
        name: `v${version}`,
        version,
        value: count,
        percentage: (count / total) * 100,
        color: VERSION_COLORS[index % VERSION_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [nodes]);

  const latestVersion = versionData[0];
  const adoptionRate = latestVersion ? latestVersion.percentage : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Version Distribution
            </CardTitle>
            <CardDescription>Software versions across the network</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Latest Version</p>
            <p className="text-xl font-bold">{latestVersion?.name || 'N/A'}</p>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(adoptionRate, 1)} adoption
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pie" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="pie" className="space-y-4">
            <PieChart
              data={versionData}
              height={300}
              showLegend={true}
              innerRadius={60}
              outerRadius={100}
              tooltipFormatter={(value, name) => `${value} nodes`}
            />
          </TabsContent>

          <TabsContent value="bar" className="space-y-4">
            <BarChart
              data={versionData.map((v) => ({
                version: v.name,
                count: v.value,
              }))}
              bars={[
                {
                  dataKey: 'count',
                  name: 'Nodes',
                  color: 'hsl(var(--primary))',
                },
              ]}
              xAxisKey="version"
              height={300}
              showLegend={false}
            />
          </TabsContent>
        </Tabs>

        {/* Version list */}
        <div className="mt-4 space-y-2 border-t pt-4">
          <p className="text-sm font-medium">Version Breakdown</p>
          <div className="space-y-2">
            {versionData.map((version) => (
              <div
                key={version.version}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: version.color }}
                  />
                  <span className="text-sm font-medium">{version.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{version.value} nodes</span>
                  <span className="font-medium">{formatPercentage(version.percentage, 1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}