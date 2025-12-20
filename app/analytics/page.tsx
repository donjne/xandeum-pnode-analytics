'use client';

import { useNetworkReady } from '@/hooks/use-network-ready';
import {
  NetworkGrowthChart,
  StorageAnalysis,
  HeartbeatHealth,
  VersionDistribution,
  CreditDistribution,
} from '@/components/analytics';

export default function AnalyticsPage() {
  const { isLoading } = useNetworkReady();

  if (isLoading) {
    return null; // or a global analytics skeleton later
  }

  return (
    <div className="animate-fade-in">
      <section className="mb-32">
        <VersionDistribution />
      </section>
      <section className="mb-32">
        <CreditDistribution />
      </section>
      <section className="mb-32">
        <NetworkGrowthChart />
      </section>
      <section className="mb-32">
        <HeartbeatHealth />
      </section>
      <section>
        <StorageAnalysis />
      </section>
    </div>
  );
}
