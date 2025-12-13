import * as React from 'react';
import {
  Line,
  Bar,
  Area,
  LineChart,
  BarChart,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { cn } from '@/lib/utils';

// Chart Container
interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  config?: Record<string, { label: string; color: string }>;
}

export function ChartContainer({ children, className, config }: ChartContainerProps) {
  return (
    <div className={cn('w-full', className)} style={config ? { '--chart-config': JSON.stringify(config) } as React.CSSProperties : undefined}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

// Chart Tooltip
interface ChartTooltipContentProps extends TooltipProps<any, any> {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
  hideIndicator,
  indicator = 'dot',
  nameKey = 'name',
  labelKey = 'value',
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      {!hideLabel && label && (
        <div className="mb-2 border-b pb-2 text-xs font-medium">{label}</div>
      )}
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {!hideIndicator && (
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  indicator === 'line' && 'h-px w-3',
                  indicator === 'dashed' && 'h-px w-3 border-t-2 border-dashed'
                )}
                style={{ backgroundColor: entry.color }}
              />
            )}
            <span className="font-medium">{entry[nameKey]}:</span>
            <span className="ml-auto font-mono">{entry[labelKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart Legend
export function ChartLegend({ payload }: any) {
  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// Styled Chart Components
export const StyledLineChart = LineChart;
export const StyledBarChart = BarChart;
export const StyledAreaChart = AreaChart;
export const StyledLine = Line;
export const StyledBar = Bar;
export const StyledArea = Area;
export const StyledXAxis = XAxis;
export const StyledYAxis = YAxis;
export const StyledCartesianGrid = CartesianGrid;
export const StyledTooltip = Tooltip;
export const StyledLegend = Legend;

// Export types
export type { ChartContainerProps, ChartTooltipContentProps };