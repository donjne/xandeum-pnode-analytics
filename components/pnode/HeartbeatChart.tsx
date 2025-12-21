'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

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

import { cn } from '@/lib/utils';

/* ---------------------------------------------
   Types
--------------------------------------------- */
export interface HeartbeatPoint {
  timestamp: number;
  success: number;
  failed: number;
}

interface HeartbeatChartProps {
  data?: HeartbeatPoint[];
}

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
function formatTime(ts: number) {
  const date = new Date(ts);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function HeartbeatChart({ data }: HeartbeatChartProps) {
  /* -------------------------------------------
     No data available
  ------------------------------------------- */
  if (!data || data.length === 0) {
    return (
      <Card
        className={cn(
          'rounded-2xl border border-transparent',
          'bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]',
          'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
          'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
        )}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Heartbeat History
          </CardTitle>
          <CardDescription>
            Historical heartbeat reliability
          </CardDescription>
        </CardHeader>

        <CardContent className="flex h-[260px] items-center justify-center">
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Heartbeat history will appear once per-node heartbeat metrics are
            available.
          </p>
        </CardContent>
      </Card>
    );
  }

  /* -------------------------------------------
     Normalize data
  --------------------------------------------- */
  const chartData = data.map((d) => ({
    time: formatTime(
      d.timestamp < 1e12 ? d.timestamp * 1000 : d.timestamp
    ),
    success: d.success,
    failed: d.failed,
  }));

  const totalSuccess = data.reduce((s, d) => s + d.success, 0);
  const totalFailed = data.reduce((s, d) => s + d.failed, 0);
  const successRate =
    totalSuccess + totalFailed > 0
      ? (totalSuccess / (totalSuccess + totalFailed)) * 100
      : 0;

  /* -------------------------------------------
     Render
  --------------------------------------------- */
  return (
    <Card
      className={cn(
        'rounded-2xl border border-transparent',
        'bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]',
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Heartbeat History
        </CardTitle>
        <CardDescription>
          {successRate.toFixed(1)}% success rate across recorded intervals
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer className="h-[300px]">
          <StyledBarChart data={chartData}>
            <StyledCartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
            />

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
            />

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
              name="Successful"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />

            <StyledBar
              dataKey="failed"
              name="Failed"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </StyledBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
