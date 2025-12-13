import * as React from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/AreaChart';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNetworkStore } from '@/stores/networkStore';
import { formatPercentage } from '@/lib/utils';

// Mock heartbeat data generator
const generateHeartbeatData = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (23 - i));
    return {
      hour: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      success: Math.floor(2700 + Math.random() * 100),
      failed: Math.floor(50 + Math.random() * 30),
      missed: Math.floor(30 + Math.random() * 20),
      successRate: 96 + Math.random() * 3,
    };
  });
};

const getHealthStatus = (successRate: number) => {
  if (successRate >= 98) return { label: 'Excellent', color: 'text-green-500', icon: CheckCircle };
  if (successRate >= 95) return { label: 'Good', color: 'text-blue-500', icon: CheckCircle };
  if (successRate >= 90) return { label: 'Fair', color: 'text-yellow-500', icon: AlertCircle };
  return { label: 'Poor', color: 'text-red-500', icon: AlertCircle };
};

export function HeartbeatHealth() {
  const { nodes } = useNetworkStore();
  const [heartbeatData] = React.useState(generateHeartbeatData);

  const currentData = heartbeatData[heartbeatData.length - 1];
  const totalHeartbeats = currentData.success + currentData.failed + currentData.missed;
  const successRate = (currentData.success / totalHeartbeats) * 100;
  const healthStatus = getHealthStatus(successRate);
  const StatusIcon = healthStatus.icon;

  // Calculate 24h average
  const avg24hSuccess = heartbeatData.reduce((sum, d) => sum + d.successRate, 0) / heartbeatData.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Heartbeat Health
            </CardTitle>
            <CardDescription>Network heartbeat success rates and reliability</CardDescription>
          </div>
          <div className="space-y-1 text-left sm:text-right">
            <div className="flex items-center gap-2 sm:justify-end">
              <StatusIcon className={`h-5 w-5 ${healthStatus.color}`} />
              <span className={`text-sm font-medium ${healthStatus.color}`}>
                {healthStatus.label}
              </span>
            </div>
            <p className="text-2xl font-bold">{formatPercentage(successRate, 2)}</p>
            <p className="text-xs text-muted-foreground">current success rate</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current status - responsive grid */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-green-500/10 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Successful</p>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <p className="mt-1 text-xl font-bold">{currentData.success.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {formatPercentage((currentData.success / totalHeartbeats) * 100, 1)}
            </p>
          </div>
          <div className="rounded-lg border bg-red-500/10 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Failed</p>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="mt-1 text-xl font-bold">{currentData.failed.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {formatPercentage((currentData.failed / totalHeartbeats) * 100, 1)}
            </p>
          </div>
          <div className="rounded-lg border bg-yellow-500/10 p-3 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Missed</p>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="mt-1 text-xl font-bold">{currentData.missed.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {formatPercentage((currentData.missed / totalHeartbeats) * 100, 1)}
            </p>
          </div>
        </div>

        {/* Success rate progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">24h Average Success Rate</span>
            <span className="text-muted-foreground">{formatPercentage(avg24hSuccess, 2)}</span>
          </div>
          <Progress value={avg24hSuccess} className="h-2" />
        </div>

        {/* 24h trend chart */}
        <AreaChart
          data={heartbeatData}
          areas={[
            {
              dataKey: 'success',
              name: 'Success',
              color: '#10b981',
              stackId: '1',
            },
            {
              dataKey: 'failed',
              name: 'Failed',
              color: '#ef4444',
              stackId: '1',
            },
            {
              dataKey: 'missed',
              name: 'Missed',
              color: '#f59e0b',
              stackId: '1',
            },
          ]}
          xAxisKey="hour"
          tooltipFormatter={(value) => `${value.toLocaleString()} beats`}
          height={200}
          showLegend={true}
          useGradient={false}
        />

        {/* Network reliability metrics - responsive grid */}
        <div className="space-y-3 border-t pt-4">
          <p className="text-sm font-medium">Network Reliability</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-xs text-muted-foreground">Heartbeat Interval</span>
              <Badge variant="secondary" className="text-xs">30s</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-xs text-muted-foreground">Expected/Hour</span>
              <span className="text-xs font-medium">120</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-xs text-muted-foreground">24h Uptime</span>
              <span className="text-xs font-medium">{formatPercentage(avg24hSuccess, 2)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-xs text-muted-foreground">Nodes Reporting</span>
              <span className="text-xs font-medium">{nodes.length}</span>
            </div>
          </div>
        </div>

        {/* Credit impact info - responsive layout */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
          <p className="text-sm font-medium">Credit System Impact</p>
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Success Credit</span>
              <Badge variant="outline" className="text-green-500">+1</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Failure Penalty</span>
              <Badge variant="outline" className="text-red-500">-100</Badge>
            </div>
            <div className="flex items-center justify-between sm:col-span-2">
              <span className="text-muted-foreground">Max Daily Credits (100% uptime)</span>
              <Badge variant="outline" className="text-blue-500">~2,880</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}