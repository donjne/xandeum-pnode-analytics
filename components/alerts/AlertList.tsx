'use client';

import * as React from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertCard } from './AlertCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAlertStore } from '@/stores/alertStore';
import { Alert } from '@/lib/types/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell } from 'lucide-react';

interface AlertListProps {
  onCreateNew: () => void;
  onEdit: (alert: Alert) => void;
}

export function AlertList({ onCreateNew, onEdit }: AlertListProps) {
  const { alerts, toggleAlertStatus, deleteAlert } = useAlertStore();
  const [severityFilter, setSeverityFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredAlerts = React.useMemo(() => {
    return alerts.filter((alert) => {
      if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
      if (statusFilter === 'enabled' && !alert.enabled) return false;
      if (statusFilter === 'disabled' && alert.enabled) return false;
      return true;
    });
  }, [alerts, severityFilter, statusFilter]);

  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No alerts configured"
        description="Create your first alert to get notified about important network events"
        action={{
          label: 'Create Alert',
          onClick: onCreateNew,
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No alerts match your filters
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onToggle={toggleAlertStatus}
              onEdit={onEdit}
              onDelete={deleteAlert}
            />
          ))
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4 text-sm">
        <span className="text-muted-foreground">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </span>
        <span className="text-muted-foreground">
          {alerts.filter((a) => a.enabled).length} enabled
        </span>
      </div>
    </div>
  );
}