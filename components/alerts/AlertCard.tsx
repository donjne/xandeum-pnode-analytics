'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useAlertStore } from '@/stores/alertStore';
import type { Alert } from '@/lib/types/alert';

export function AlertCard({ alert }: { alert: Alert }) {
  const { toggleAlert, deleteAlert } = useAlertStore();

  return (
    <Card className="p-4 flex items-center justify-between">
      <div className="space-y-1">
        <p className="font-medium">{alert.name}</p>
        <p className="text-xs text-muted-foreground">
          {alert.condition} · {alert.severity}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={alert.enabled}
          onCheckedChange={() => toggleAlert(alert.id)}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteAlert(alert.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
