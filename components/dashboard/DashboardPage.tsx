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
  // This hook fetches network data on mount and handles auto-refresh
  useNetwork();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Stats - Responsive Grid */}
      <QuickStats />

      {/* Network Health & Top Performers - Responsive Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <NetworkHealth />
        <TopPerformers />
      </div>

      {/* Geographic Distribution */}
      <NetworkMap />

      {/* Live Activity Feed */}
      <LiveActivityFeed />
    </div>
  );
}