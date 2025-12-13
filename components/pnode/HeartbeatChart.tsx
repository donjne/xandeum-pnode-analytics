import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  StyledBarChart,
  StyledBar,
  StyledXAxis,
  StyledYAxis,
  StyledCartesianGrid,
  StyledTooltip,
} from '@/components/ui/chart';

interface HeartbeatChartProps {
  data?: Array<{ timestamp: number; success: number; failed: number }>;
}

// Mock data generator
const generateMockData = () => {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    timestamp: now - (23 - i) * 60 * 60 * 1000,
    success: Math.floor(Math.random() * 20) + 100,
    failed: Math.floor(Math.random() * 5),
  }));
};

export function HeartbeatChart({ data = generateMockData() }: HeartbeatChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    success: d.success,
    failed: d.failed,
  }));

  const totalSuccess = chartData.reduce((sum, d) => sum + d.success, 0);
  const totalFailed = chartData.reduce((sum, d) => sum + d.failed, 0);
  const successRate = ((totalSuccess / (totalSuccess + totalFailed)) * 100).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heartbeat Success Rate</CardTitle>
        <CardDescription>
          24-hour heartbeat history • {successRate}% success rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <StyledBarChart data={chartData}>
            <StyledCartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <StyledXAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <StyledYAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <StyledTooltip
              content={
                <ChartTooltipContent
                  labelKey="time"
                  formatter={(value, name) =>
                    `${value} ${name === 'success' ? 'successful' : 'failed'}`
                  }
                />
              }
            />
            <StyledBar
              dataKey="success"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Success"
            />
            <StyledBar
              dataKey="failed"
              fill="hsl(var(--destructive))"
              radius={[4, 4, 0, 0]}
              name="Failed"
            />
          </StyledBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}