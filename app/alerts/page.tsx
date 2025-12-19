'use client';

import { useEffect } from 'react';
import { useAlertStore } from '@/stores/alertStore';
import { AlertForm, AlertCard, UnsubscribeBox } from '@/components/alerts';

export default function AlertsPage() {
  const { alerts, fetchAlerts } = useAlertStore();

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-8">
      <AlertForm onDone={fetchAlerts} />

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-muted-foreground">No alerts created</p>
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
