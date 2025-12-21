'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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

import { AlertCircle } from 'lucide-react';
import { formatPercentage } from '@/lib/utils';

/* ---------------------------------------------
   Types
--------------------------------------------- */
export interface UptimePoint {
  timestamp: number; // unix ms
  uptimePercent: number; // 0–100
}

interface UptimeChartProps {
  data?: UptimePoint[];
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function UptimeChart({ data }: UptimeChartProps) {
  /* ---------------------------
     No data yet (honest state)
  ---------------------------- */
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uptime History</CardTitle>
          <CardDescription>
            Historical uptime snapshots are not available yet
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex h-[260px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Uptime tracking will appear once historical data is recorded.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* ---------------------------
     Transform
  ---------------------------- */
  const chartData = data.map((d) => ({
    day: new Date(d.timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
    }),
    uptime: d.uptimePercent,
  }));

  /* ---------------------------
     Render
  ---------------------------- */
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uptime History</CardTitle>
        <CardDescription>
          Recent uptime percentage over time
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer className="h-[300px]">
          <StyledAreaChart data={chartData}>
            <defs>
              <linearGradient
                id="uptime-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <StyledCartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <StyledXAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <StyledYAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />

            <StyledTooltip
              content={
                <ChartTooltipContent
                  labelKey="day"
                  formatter={(v) =>
                    formatPercentage(Number(v), 1)
                  }
                />
              }
            />

            <StyledArea
              type="monotone"
              dataKey="uptime"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#uptime-gradient)"
              name="Uptime"
            />
          </StyledAreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
