'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAlertStore } from '@/stores/alertStore';

export function AlertForm({ onDone }: { onDone: () => void }) {
  const { createAlert } = useAlertStore();

  const [email, setEmail] = React.useState('');
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setToken(data.token);

      createAlert({
        name: 'Node Offline',
        condition: 'node_offline',
        severity: 'high',
        enabled: true,
      });

      onDone();
    } catch (err: any) {
      setError(err.message ?? 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card className="rounded-xl border bg-white p-6 shadow-sm dark:bg-[#0A0E27]">
        <h2 className="text-lg font-semibold">Alert Email</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Alerts will be sent to this email address
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create Alert'}
          </Button>
        </form>
      </Card>

      {/* One-time token modal */}
      <Dialog open={!!token}>
        <DialogContent className="space-y-4 text-center">
          <h3 className="text-lg font-semibold">Unsubscribe Code</h3>

          <div className="rounded-lg bg-muted px-4 py-3 font-mono text-xl tracking-widest">
            {token}
          </div>

          <p className="text-sm text-muted-foreground">
            Save this code. It will never be shown again.
          </p>

          <Button onClick={() => setToken(null)}>
            I&apos;ve saved it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
