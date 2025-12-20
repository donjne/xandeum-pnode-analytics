'use client';

import { useAlertStore } from '@/stores/alertStore';
import { AlertForm } from '@/components/alerts/AlertForm';
import { AlertCard } from '@/components/alerts/AlertCard';
import { UnsubscribeBox } from '@/components/alerts/UnsubscribeBox';

export default function AlertsPage() {
  const { alerts } = useAlertStore();

  return (
    <div className="space-y-10">
      <AlertForm onDone={() => {}} />

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No alerts created
          </p>
        ) : (
          alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>

      <UnsubscribeBox />
    </div>
  );
}
