'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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

import { cn, formatBytes } from '@/lib/utils';

/* ---------------------------------------------
   Types
--------------------------------------------- */
interface StoragePoint {
  timestamp: number;
  used: number;
  committed: number;
}

interface StorageChartProps {
  data?: StoragePoint[];
}

/* ---------------------------------------------
   Component
--------------------------------------------- */
export function StorageChart({ data }: StorageChartProps) {
  /* -------------------------------------------
     Empty / no history yet
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
            Storage Utilization
          </CardTitle>
        </CardHeader>

        <CardContent className="flex h-[260px] items-center justify-center">
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Storage history will appear once periodic snapshots are available.
          </p>
        </CardContent>
      </Card>
    );
  }

  /* -------------------------------------------
     Transform data (bytes → GB)
  ------------------------------------------- */
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }),
    used: d.used / 1024 ** 3,
    committed: d.committed / 1024 ** 3,
  }));

  const latest = data[data.length - 1];

  /* -------------------------------------------
     Render
  ------------------------------------------- */
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
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            Storage Utilization
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Used vs committed storage over time
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current usage</span>
          <span className="font-medium">
            {formatBytes(latest.used)} / {formatBytes(latest.committed)}
          </span>
        </div>

        {/* Chart */}
        <ChartContainer className="h-[260px]">
          <StyledLineChart data={chartData}>
            <StyledCartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted/30"
            />

            <StyledXAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />

            <StyledYAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v} GB`}
            />

            <StyledTooltip
              content={
                <ChartTooltipContent
                  labelKey="time"
                  formatter={(value, name) =>
                    `${Number(value).toFixed(1)} GB`
                  }
                />
              }
            />

            {/* Capacity reference */}
            <StyledLine
              type="monotone"
              dataKey="committed"
              name="Committed"
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.4}
              strokeWidth={2}
              dot={false}
            />

            {/* Actual usage */}
            <StyledLine
              type="monotone"
              dataKey="used"
              name="Used"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={false}
            />
          </StyledLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
