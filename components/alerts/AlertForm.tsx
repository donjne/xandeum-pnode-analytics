'use client';

import * as React from 'react';
import { Alert } from '@/lib/types/alert';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Props {
  alert?: Alert;
  onSubmit: (alert: Alert) => void;
  onCancel: () => void;
}

export function AlertForm({ alert, onSubmit, onCancel }: Props) {
  const [name, setName] = React.useState(alert?.name ?? '');
  const [condition, setCondition] = React.useState('node_offline');
  const [severity, setSeverity] = React.useState('medium');

  const handleSubmit = () => {
    onSubmit({
      id: alert?.id ?? `alert-${Date.now()}`,
      name,
      condition,
      severity,
      enabled: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      triggerCount: 0,
      priority: severity,
    } as Alert);
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label>Alert Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="High storage usage"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Condition</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="node_offline">Node Offline</SelectItem>
                <SelectItem value="storage_threshold">Storage Threshold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Alert</Button>
        </div>
      </CardContent>
    </Card>
  );
}
