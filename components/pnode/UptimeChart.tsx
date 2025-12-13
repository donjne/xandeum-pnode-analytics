import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  StyledAreaChart,
  StyledArea,
  StyledXAxis,
  StyledYAxis,
  StyledCartesianGrid,
  StyledTooltip,
} from '@/components/ui/chart';
import { formatPercentage } from '@/lib/utils';

interface UptimeChartProps {
  data?: Array<{ timestamp: number; uptime: number }>;
}

// Mock data generator
const generateMockData = () => {
  const now = Date.now();
  return Array.from({ length: 7 }, (_, i) => ({
    timestamp: now - (6 - i) * 24 * 60 * 60 * 1000,
    uptime: 95 + Math.random() * 5, // 95-100% uptime
  }));
};

export function UptimeChart({ data = generateMockData() }: UptimeChartProps) {
  const chartData = data.map((d) => ({
    day: new Date(d.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    uptime: d.uptime,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uptime History</CardTitle>
        <CardDescription>7-day uptime percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <StyledAreaChart data={chartData}>
            <defs>
              <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <StyledCartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <StyledXAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <StyledYAxis
              domain={[90, 100]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <StyledTooltip
              content={
                <ChartTooltipContent
                  labelKey="day"
                  formatter={(value) => `${Number(value).toFixed(2)}%`}
                />
              }
            />
            <StyledArea
              type="monotone"
              dataKey="uptime"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#uptimeGradient)"
              name="Uptime"
            />
          </StyledAreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}