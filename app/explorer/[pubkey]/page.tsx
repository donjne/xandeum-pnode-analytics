'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { 
  PNodeHeader, 
  PNodeOverview, 
  HealthScore, 
  StorageChart, 
  UptimeChart, 
  HeartbeatChart,
  RewardsPanel,
  GossipConnections 
} from '@/components/pnode';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useNode } from '@/hooks/use-network';
import { AlertCircle } from 'lucide-react';

export default function PNodeDetailPage() {
  const params = useParams();
  const pubkey = params.pubkey as string;
  const { node, isLoading, notFound } = useNode(pubkey);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Loading pNode details..." />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon={AlertCircle}
          title="pNode Not Found"
          description={`No pNode found with pubkey: ${pubkey}`}
          action={{
            label: "Back to Explorer",
            onClick: () => window.location.href = '/explorer'
          }}
        />
      </div>
    );
  }

  // TypeScript: node is guaranteed to be defined here due to early return above
  const definedNode = node!;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with back button and node info */}
      <PNodeHeader node={definedNode} />

      {/* Overview and Health Score - Responsive Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PNodeOverview node={definedNode} />
        <HealthScore node={definedNode} />
      </div>

      {/* Storage and Uptime Charts - Responsive Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StorageChart />
        <UptimeChart />
      </div>

      {/* Heartbeat Chart - Full Width */}
      <HeartbeatChart />

      {/* Rewards and Connections - Responsive Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RewardsPanel />
        <GossipConnections />
      </div>
    </div>
  );
}