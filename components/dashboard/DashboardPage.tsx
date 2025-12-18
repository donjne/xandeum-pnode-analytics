'use client';

import { useNetwork } from '@/hooks/use-network';
import { 
  QuickStats, 
  NetworkHealth, 
  TopPerformers, 
  LiveActivityFeed,
  NetworkMap 
} from '@/components/dashboard';

export function DashboardPage() {
  useNetwork();

  return (
    <div className="space-y-6 animate-fade-in">
      <QuickStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <NetworkHealth />
        <TopPerformers />
      </div>

      <NetworkMap />
      <LiveActivityFeed />
    </div>
  );
}