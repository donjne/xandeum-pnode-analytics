'use client';

import { useAlertStore } from '@/stores/alertStore';
import { AlertCard } from './AlertCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Bell } from 'lucide-react';
import { Alert } from '@/lib/types/alert';

export function AlertList({ onEdit }: { onEdit: (a: Alert) => void }) {
  const { alerts, toggleAlertStatus, deleteAlert } = useAlertStore();

  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No alerts configured"
        description="Create an alert to get notified when something goes wrong"
      />
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onEdit={onEdit}
          onToggle={toggleAlertStatus}
          onDelete={deleteAlert}
        />
      ))}
    </div>
  );
}
