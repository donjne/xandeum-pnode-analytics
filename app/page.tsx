'use client';

import { 
  QuickStats, 
  NetworkHealth, 
  TopPerformers, 
  LiveActivityFeed,
  NetworkMap 
} from '@/components/dashboard';


export default function Home() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Network Dashboard
        </h1>
        <p className="text-muted-foreground">
          Realtime overview of the Xandeum pNode network
        </p>
      </div>

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