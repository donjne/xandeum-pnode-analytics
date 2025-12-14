'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  StyledLineChart,
  StyledLine,
  StyledXAxis,
  StyledYAxis,
  StyledCartesianGrid,
  StyledTooltip,
} from '@/components/ui/chart';

interface StorageChartProps {
  data?: Array<{ timestamp: number; used: number; committed: number }>;
}

// Mock data generator
const generateMockData = () => {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    timestamp: now - (23 - i) * 60 * 60 * 1000,
    used: Math.floor(Math.random() * 50 * 1024 * 1024 * 1024) + 10 * 1024 * 1024 * 1024,
    committed: 100 * 1024 * 1024 * 1024,
  }));
};

export function StorageChart({ data = generateMockData() }: StorageChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    used: d.used / (1024 * 1024 * 1024), // Convert to GB
    committed: d.committed / (1024 * 1024 * 1024),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Utilization</CardTitle>
        <CardDescription>24-hour storage usage history</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <StyledLineChart data={chartData}>
            <StyledCartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <StyledXAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <StyledYAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}GB`}
            />
            <StyledTooltip
              content={
                <ChartTooltipContent
                  labelKey="time"
                  formatter={(value) => `${Number(value).toFixed(2)} GB`}
                />
              }
            />
            <StyledLine
              type="monotone"
              dataKey="committed"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Committed"
            />
            <StyledLine
              type="monotone"
              dataKey="used"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="Used"
            />
          </StyledLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}