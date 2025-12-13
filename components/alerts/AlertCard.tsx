import * as React from 'react';
import { Bell, BellOff, Trash2, Edit, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert } from '@/lib/types';
import { formatTimeAgo } from '@/lib/utils';

interface AlertCardProps {
  alert: Alert;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (alert: Alert) => void;
  onDelete: (id: string) => void;
}

const conditionLabels: Record<Alert['condition'], string> = {
  node_offline: 'Node Goes Offline',
  storage_threshold: 'Storage Threshold',
  performance_degraded: 'Performance Degraded',
  version_outdated: 'Version Outdated',
  heartbeat_missed: 'Heartbeat Missed',
};

const severityColors: Record<Alert['severity'], string> = {
  low: 'border-blue-500/20 bg-blue-500/10 text-blue-500',
  medium: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500',
  high: 'border-orange-500/20 bg-orange-500/10 text-orange-500',
  critical: 'border-red-500/20 bg-red-500/10 text-red-500',
};

export function AlertCard({ alert, onToggle, onEdit, onDelete }: AlertCardProps) {
  return (
    <Card className={alert.enabled ? '' : 'opacity-60'}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2">
              {alert.enabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <h3 className="font-semibold">{alert.name}</h3>
              <Badge variant="outline" className={severityColors[alert.severity]}>
                {alert.severity}
              </Badge>
            </div>

            {/* Description */}
            {alert.description && (
              <p className="text-sm text-muted-foreground">{alert.description}</p>
            )}

            {/* Condition */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{conditionLabels[alert.condition]}</Badge>
              {alert.threshold && (
                <>
                  <span>•</span>
                  <span>Threshold: {alert.threshold}%</span>
                </>
              )}
              <span>•</span>
              <span>Channel: {alert.channel}</span>
            </div>

            {/* Last triggered */}
            {alert.lastTriggered && (
              <p className="text-xs text-muted-foreground">
                Last triggered {formatTimeAgo(alert.lastTriggered)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Switch checked={alert.enabled} onCheckedChange={(checked) => onToggle(alert.id, checked)} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(alert)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(alert.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}