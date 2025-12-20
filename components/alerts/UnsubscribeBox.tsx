'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function UnsubscribeBox() {
  const [token, setToken] = React.useState('');
  const [status, setStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleUnsubscribe() {
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch('/api/alerts/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus('You have been unsubscribed.');
      setToken('');
    } catch (err: any) {
      setStatus(err.message ?? 'Unsubscribe failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-xl border border-dashed border-red-500/30 bg-red-500/5 p-6">
      <h3 className="font-semibold text-red-600">
        Unsubscribe from alerts
      </h3>

      <p className="mb-4 text-sm text-muted-foreground">
        Enter the unsubscribe code you received when subscribing
      </p>

      <div className="space-y-3">
        <Input
          placeholder="Unsubscribe code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <Button
          variant="outline"
          onClick={handleUnsubscribe}
          disabled={loading || !token}
        >
          {loading ? 'Processing…' : 'Unsubscribe'}
        </Button>

        {status && (
          <p className="text-sm text-muted-foreground">{status}</p>
        )}
      </div>
    </Card>
  );
}
