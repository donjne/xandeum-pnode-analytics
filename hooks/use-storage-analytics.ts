'use client';

import { useEffect, useState } from 'react';

export interface StoragePoint {
  date: string;
  total_committed: number;
  total_used: number;
  utilization: number;
}

export function useStorageAnalytics() {
  const [data, setData] = useState<StoragePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/storage')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
