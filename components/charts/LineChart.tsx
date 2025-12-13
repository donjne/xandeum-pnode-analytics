import * as React from 'react';
import {
  ChartContainer,
  ChartTooltipContent,
  StyledLineChart,
  StyledLine,
  StyledXAxis,
  StyledYAxis,
  StyledCartesianGrid,
  StyledTooltip,
  StyledLegend,
  ChartLegend,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface LineChartDataPoint {
  [key: string]: string | number;
}

export interface LineChartLine {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

interface LineChartProps {
  title?: string;
  description?: string;
  data: LineChartDataPoint[];
  lines: LineChartLine[];
  xAxisKey: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  className?: string;
}

export function LineChart({
  title,
  description,
  data,
  lines,
  xAxisKey,
  yAxisFormatter,
  tooltipFormatter,
  height = 300,
  showLegend = true,
  showGrid = true,
  className,
}: LineChartProps) {
  const content = (
    <ChartContainer className={`h-[${height}px]`}>
      <StyledLineChart data={data}>
        {showGrid && <StyledCartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
        <StyledXAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <StyledYAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={yAxisFormatter}
        />
        <StyledTooltip
          content={
            <ChartTooltipContent
              labelKey={xAxisKey}
              formatter={tooltipFormatter}
            />
          }
        />
        {showLegend && <StyledLegend content={<ChartLegend />} />}
        {lines.map((line) => (
          <StyledLine
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={line.strokeWidth || 2}
            strokeDasharray={line.strokeDasharray}
            dot={false}
          />
        ))}
      </StyledLineChart>
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