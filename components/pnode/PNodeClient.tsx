'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

import {
  PNodeHeader,
  PNodeOverview,
  HealthScore,
  StorageChart,
  UptimeChart,
  HeartbeatChart,
  RewardsPanel,
  GossipConnections,
} from '@/components/pnode';

import { useNetworkReady } from '@/hooks/use-network-ready';
import { useNetworkStore } from '@/stores/networkStore';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';

/* ---------------------------------------------
   PNode Details Client
--------------------------------------------- */
export default function PNodeClient() {
  const router = useRouter();
  const { pubkey } = useParams<{ pubkey: string }>();

  /**
   * Ensure network data is ready
   * (this hook should ONLY fetch, not select)
   */
  const { isLoading } = useNetworkReady();
  const { getNodeByPubkey } = useNetworkStore();

  /* -------------------------------------------
     Resolve node
  ------------------------------------------- */
  const node = React.useMemo(() => {
    if (!pubkey) return undefined;
    return getNodeByPubkey(pubkey);
  }, [pubkey, getNodeByPubkey]);

  /* -------------------------------------------
     Loading
  ------------------------------------------- */
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner text="Loading pNode details…" />
      </div>
    );
  }

  /* -------------------------------------------
     Not found
  ------------------------------------------- */
  if (!node) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={AlertCircle}
          title="pNode Not Found"
          description={`No pNode found with pubkey: ${pubkey}`}
          action={{
            label: 'Back to Explorer',
            onClick: () => router.push('/explorer'),
          }}
        />
      </div>
    );
  }

  /* -------------------------------------------
     Render
  ------------------------------------------- */
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PNodeHeader node={node} />

      {/* Overview + Health */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PNodeOverview node={node} />
        <HealthScore node={node} />
      </div>

      {/* Storage + Uptime (no fake data) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StorageChart />
        <UptimeChart />
      </div>

      {/* Heartbeats */}
      <HeartbeatChart />

      {/* Rewards + Gossip */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RewardsPanel />
        <GossipConnections />
      </div>
    </div>
  );
}
