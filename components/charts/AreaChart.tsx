import {
  ChartContainer,
  ChartTooltipContent,
  StyledAreaChart,
  StyledArea,
  StyledXAxis,
  StyledYAxis,
  StyledCartesianGrid,
  StyledTooltip,
  StyledLegend,
  ChartLegend,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface AreaChartDataPoint {
  [key: string]: string | number;
}

export interface AreaChartArea {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
  fillOpacity?: number;
  stackId?: string;
}

interface AreaChartProps {
  title?: string;
  description?: string;
  data: AreaChartDataPoint[];
  areas: AreaChartArea[];
  xAxisKey: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  useGradient?: boolean;
  className?: string;
}

export function AreaChart({
  title,
  description,
  data,
  areas,
  xAxisKey,
  yAxisFormatter,
  tooltipFormatter,
  height = 300,
  showLegend = true,
  showGrid = true,
  useGradient = true,
  className,
}: AreaChartProps) {
  const content = (
    <ChartContainer className={`h-[${height}px]`}>
      <StyledAreaChart data={data}>
        {useGradient && (
          <defs>
            {areas.map((area) => (
              <linearGradient key={area.dataKey} id={`gradient-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={area.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
        )}
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
        {areas.map((area) => (
          <StyledArea
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            stroke={area.color}
            strokeWidth={area.strokeWidth || 2}
            fill={useGradient ? `url(#gradient-${area.dataKey})` : area.color}
            fillOpacity={area.fillOpacity || 1}
            stackId={area.stackId}
          />
        ))}
      </StyledAreaChart>
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