'use client';

import * as React from 'react';
import { AlertList, AlertForm, NotificationChannels } from '@/components/alerts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Alert } from '@/lib/types/alert';

export default function AlertsPage() {
  const [editingAlert, setEditingAlert] = React.useState<Alert | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingAlert({
      id: '',
      name: '',
      description: '',
      enabled: true,
      condition: 'health_score < 80',
      severity: 'medium',
      threshold: 80,
      channel: 'email',
      priority: 'medium',
      triggerCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  const handleEdit = (alert: Alert) => {
    setIsCreating(false);
    setEditingAlert(alert);
  };

  const handleSubmit = (alert: Alert) => {
    // TODO: Save alert to backend/store
    console.log('Saving alert:', alert);
    setEditingAlert(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingAlert(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Alert Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure alerts and notification channels
          </p>
        </div>
        
        {!editingAlert && (
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        )}
      </div>

      {/* Alert Form (when creating/editing) */}
      {editingAlert && (
        <AlertForm
          alert={editingAlert}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Alert List (when not editing) */}
      {!editingAlert && (
        <>
          <AlertList onCreateNew={handleCreateNew} onEdit={handleEdit} />
          
          {/* Notification Channels */}
          <NotificationChannels />
        </>
      )}
    </div>
  );
}