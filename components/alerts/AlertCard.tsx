'use client';

import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAlertStore } from '@/stores/alertStore';
import type { Alert } from '@/lib/types/alert';

export function AlertCard({ alert }: { alert: Alert }) {
  const { toggleAlert, deleteAlert } = useAlertStore();

  return (
    <Card className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm dark:bg-[#0A0E27]">
      <div className="space-y-1">
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {alert.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{alert.condition}</Badge>
          <Badge variant="secondary">{alert.severity}</Badge>
        </div>
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
          className="text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
