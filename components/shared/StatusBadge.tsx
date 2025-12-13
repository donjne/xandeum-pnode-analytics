import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'degraded' | 'unknown';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  online: {
    label: 'Online',
    className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    iconClassName: 'fill-green-500 text-green-500',
  },
  offline: {
    label: 'Offline',
    className: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    iconClassName: 'fill-purple-500 text-purple-500',
  },
  degraded: {
    label: 'Degraded',
    className: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    iconClassName: 'fill-orange-500 text-orange-500',
  },
  unknown: {
    label: 'Unknown',
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    iconClassName: 'fill-gray-500 text-gray-500',
  },
};

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {showIcon && <Circle className={cn('mr-1 h-2 w-2', config.iconClassName)} />}
      {config.label}
    </Badge>
  );
}