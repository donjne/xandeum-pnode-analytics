'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import { AlertList } from '@/components/alerts/AlertList';
import { AlertForm } from '@/components/alerts/AlertForm';
import { Button } from '@/components/ui/button';
import { Alert } from '@/lib/types/alert';

export default function AlertsPage() {
  const [editingAlert, setEditingAlert] = React.useState<Alert | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Alerts
          </h1>
          <p className="text-muted-foreground">
            Get notified when important network events occur
          </p>
        </div>

        {!editingAlert && (
          <Button onClick={() => setEditingAlert({} as Alert)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        )}
      </div>

      {/* Form */}
      {editingAlert && (
        <AlertForm
          alert={editingAlert}
          onSubmit={() => setEditingAlert(null)}
          onCancel={() => setEditingAlert(null)}
        />
      )}

      {/* List */}
      {!editingAlert && (
        <AlertList onEdit={setEditingAlert} />
      )}
    </div>
  );
}
