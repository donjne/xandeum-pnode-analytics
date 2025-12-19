'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function UnsubscribeBox() {
  const [token, setToken] = React.useState('');
  const [status, setStatus] = React.useState<string | null>(null);

  async function handleUnsubscribe() {
    setStatus(null);

    const res = await fetch('/api/alerts/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Unsubscribe failed');
      return;
    }

    setStatus('You have been unsubscribed.');
    setToken('');
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <p className="font-medium">Unsubscribe from alerts</p>

      <Input
        placeholder="Enter unsubscribe code"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <Button onClick={handleUnsubscribe} variant="outline">
        Unsubscribe
      </Button>

      {status && (
        <p className="text-sm text-muted-foreground">{status}</p>
      )}
    </div>
  );
}
