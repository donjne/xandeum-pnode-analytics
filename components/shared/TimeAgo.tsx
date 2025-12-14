'use client';

import * as React from 'react';
import { formatTimeAgo } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TimeAgoProps {
  timestamp: number;
  className?: string;
  showTooltip?: boolean;
}

export function TimeAgo({ timestamp, className, showTooltip = true }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = React.useState(() => formatTimeAgo(timestamp));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(timestamp));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timestamp]);

  const fullDate = new Date(timestamp * 1000).toLocaleString();

  if (!showTooltip) {
    return <span className={cn('text-sm text-muted-foreground', className)}>{timeAgo}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('cursor-help text-sm text-muted-foreground', className)}>
            {timeAgo}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{fullDate}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}