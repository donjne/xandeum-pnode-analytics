'use client';

import {
  NetworkGrowthChart,
  StorageAnalysis,
  HeartbeatHealth,
  VersionDistribution,
  CreditDistribution,
} from '@/components/analytics';

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in">
      {/* Growth — sets the tone */}
      <section className="mb-32">
        <NetworkGrowthChart />
      </section>

      {/* Storage — heavier, infrastructural */}
      <section className="mb-32">
        <StorageAnalysis />
      </section>

      {/* Health — immediate operational signal */}
      <section className="mb-32">
        <HeartbeatHealth />
      </section>

      {/* Versions — coordination & consensus */}
      <section className="mb-32">
        <VersionDistribution />
      </section>

      {/* Rewards — reflective, summary */}
      <section>
        <CreditDistribution />
      </section>
    </div>
  );
}
