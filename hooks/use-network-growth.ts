'use client';

import * as React from 'react';

export interface NetworkGrowthPoint {
  date: string;
  total: number;
  online: number;
  offline: number;
}

export function useNetworkGrowth(days = 30) {
  const [data, setData] = React.useState<NetworkGrowthPoint[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/analytics/network-growth?days=${days}`,
          { cache: 'force-cache' }
        );

        if (!res.ok) {
          throw new Error('Failed to load analytics');
        }

        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [days]);

  return { data, loading, error };
}
