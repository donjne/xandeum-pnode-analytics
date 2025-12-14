'use client';

import * as React from 'react';
import { Alert } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AlertFormProps {
  alert?: Alert;
  onSubmit: (alert: Alert) => void;
  onCancel: () => void;
}

export function AlertForm({ alert, onSubmit, onCancel }: AlertFormProps) {
  const [formData, setFormData] = React.useState<Partial<Alert>>({
    name: alert?.name || '',
    description: alert?.description || '',
    condition: alert?.condition || 'node_offline',
    severity: alert?.severity || 'medium',
    threshold: alert?.threshold,
    channel: alert?.channel || 'email',
    enabled: alert?.enabled ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAlert: Alert = {
      id: alert?.id || `alert-${Date.now()}`,
      name: formData.name || 'Unnamed Alert',
      description: formData.description,
      condition: formData.condition || 'node_offline',
      severity: formData.severity || 'medium',
      threshold: formData.threshold || 0,
      channel: formData.channel || 'email',
      enabled: formData.enabled ?? true,
      priority: formData.severity || 'medium',
      triggerCount: alert?.triggerCount || 0,
      createdAt: alert?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSubmit(fullAlert);
  };

  const showThreshold =
    formData.condition === 'storage_threshold' ||
    formData.condition === 'performance_degraded';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{alert ? 'Edit Alert' : 'Create New Alert'}</CardTitle>
        <CardDescription>
          Configure notification rules for network events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Alert Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., High Storage Usage"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this alert"
              />
            </div>
          </div>

          <Separator />

          {/* Conditions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) =>
                  setFormData({ ...formData, condition: value as Alert['condition'] })
                }
              >
                <SelectTrigger id="condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="node_offline">Node Goes Offline</SelectItem>
                  <SelectItem value="storage_threshold">Storage Threshold</SelectItem>
                  <SelectItem value="performance_degraded">Performance Degraded</SelectItem>
                  <SelectItem value="version_outdated">Version Outdated</SelectItem>
                  <SelectItem value="heartbeat_missed">Heartbeat Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showThreshold && (
              <div className="space-y-2">
                <Label htmlFor="threshold">Threshold (%)</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.threshold || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, threshold: parseInt(e.target.value) })
                  }
                  placeholder="e.g., 80"
                  required={showThreshold}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) =>
                  setFormData({ ...formData, severity: value as Alert['severity'] })
                }
              >
                <SelectTrigger id="severity">
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

          <Separator />

          {/* Notification Channel */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel">Notification Channel</Label>
              <Select
                value={formData.channel}
                onValueChange={(value) =>
                  setFormData({ ...formData, channel: value as Alert['channel'] })
                }
              >
                <SelectTrigger id="channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="enabled">Enable Alert</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when this condition is met
                </p>
              </div>
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{alert ? 'Update Alert' : 'Create Alert'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}