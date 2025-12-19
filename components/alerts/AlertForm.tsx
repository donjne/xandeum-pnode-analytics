'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectTrigger, SelectContent } from '@/components/ui/select';
import { useAlertStore } from '@/stores/alertStore';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function AlertForm({ onDone }: { onDone: () => void }) {
  const { createAlert } = useAlertStore();

  const [email, setEmail] = React.useState('');
  const [token, setToken] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1️⃣ subscribe email
    const sub = await fetch('/api/alerts/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    const subData = await sub.json();
    if (!sub.ok) throw new Error(subData.error);

    setToken(subData.token);

    // 2️⃣ create alert
    await createAlert({
      name: 'Node Offline',
      condition: 'node_offline',
      severity: 'high',
    });

    onDone();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          required
          placeholder="Alert email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit">Create Alert</Button>
      </form>

      <Dialog open={!!token}>
        <DialogContent>
          <h3 className="text-lg font-bold">Unsubscribe Code</h3>
          <p className="font-mono text-xl tracking-widest">{token}</p>
          <p className="text-sm text-muted-foreground">
            Save this. It will never be shown again.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
