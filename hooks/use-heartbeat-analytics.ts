'use client';

import { useEffect, useState } from 'react';

export interface HeartbeatPoint {
  date: string;
  success: number;
  failed: number;
  missed: number;
  success_rate: number;
}

export function useHeartbeatAnalytics() {
  const [data, setData] = useState<HeartbeatPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/heartbeat')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
