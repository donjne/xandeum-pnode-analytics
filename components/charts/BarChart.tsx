'use client';

import {
  ChartContainer,
  ChartTooltipContent,
  StyledBarChart,
  StyledBar,
  StyledXAxis,
  StyledYAxis,
  StyledCartesianGrid,
  StyledTooltip,
  StyledLegend,
  ChartLegend,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface BarChartDataPoint {
  [key: string]: string | number;
}

export interface BarChartBar {
  dataKey: string;
  name: string;
  color: string;
  radius?: [number, number, number, number];
  stackId?: string;
}

interface BarChartProps {
  title?: string;
  description?: string;
  data: BarChartDataPoint[];
  bars: BarChartBar[];
  xAxisKey: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  horizontal?: boolean;
  className?: string;
}

export function BarChart({
  title,
  description,
  data,
  bars,
  xAxisKey,
  yAxisFormatter,
  tooltipFormatter,
  height = 300,
  showLegend = true,
  showGrid = true,
  horizontal = false,
  className,
}: BarChartProps) {
  const content = (
    <ChartContainer className={`h-[${height}px]`}>
      <StyledBarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'}>
        {showGrid && <StyledCartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
        {horizontal ? (
          <>
            <StyledXAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} />
            <StyledYAxis type="category" dataKey={xAxisKey} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          </>
        ) : (
          <>
            <StyledXAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <StyledYAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} />
          </>
        )}
        <StyledTooltip
          content={
            <ChartTooltipContent
              labelKey={xAxisKey}
              formatter={tooltipFormatter}
            />
          }
        />
        {showLegend && <StyledLegend content={<ChartLegend />} />}
        {bars.map((bar) => (
          <StyledBar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            radius={bar.radius || [4, 4, 0, 0]}
            stackId={bar.stackId}
          />
        ))}
      </StyledBarChart>
    </ChartContainer>
  );

  if (!title) {
    return content;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}