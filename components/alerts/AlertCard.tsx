'use client';

import { Bell, BellOff, Edit, Trash2 } from 'lucide-react';
import { Alert } from '@/lib/types/alert';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface Props {
  alert: Alert;
  onEdit: (alert: Alert) => void;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

export function AlertCard({ alert, onEdit, onToggle, onDelete }: Props) {
  return (
    <Card className={!alert.enabled ? 'opacity-60' : ''}>
      <CardContent className="flex items-start justify-between p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {alert.enabled ? (
              <Bell className="h-4 w-4 text-primary" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
            <h3 className="font-semibold">{alert.name}</h3>
            <Badge variant="outline">{alert.severity}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Condition: {alert.condition}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={alert.enabled}
            onCheckedChange={(v) => onToggle(alert.id, v)}
          />
          <Button size="icon" variant="ghost" onClick={() => onEdit(alert)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(alert.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
