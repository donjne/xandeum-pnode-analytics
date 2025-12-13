import { useQuery, useQueryClient } from '@tanstack/react-query';
import { prpcClient } from '@/lib/api/prpc-client';
import { PNode, PNodeStats } from '@/lib/types/pnode';
import { useAppStore } from '@/stores/appStore';
import { useEffect } from 'react';

interface UsePNodesOptions {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: PNode[]) => void;
  onError?: (error: Error) => void;
}

export interface UsePNodesResult {
  pnodes: PNode[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  isStale: boolean;
  refetch: () => void;
  lastUpdated?: number;
  stats: PNodeStats;
}

export function usePNodes(options: UsePNodesOptions = {}): UsePNodesResult {
  const {
    enabled = true,
    refetchInterval: customRefetchInterval,
    onSuccess,
    onError,
  } = options;

  const queryClient = useQueryClient();
  const { settings, updateLastSync, setNetworkConnected, incrementErrorCount, resetErrorCount } = useAppStore();
  
  const refetchInterval = customRefetchInterval ?? (settings.autoRefresh ? settings.refreshInterval : false);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    isStale,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['pnodes'],
    queryFn: async () => {
      try {
        const pnodes = await prpcClient.getPodsWithStats();
        setNetworkConnected(true);
        resetErrorCount();
        updateLastSync();
        return pnodes;
      } catch (err) {
        incrementErrorCount();
        setNetworkConnected(false);
        throw err;
      }
    },
    enabled,
    refetchInterval,
    staleTime: 10000,
    gcTime: 300000,
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (data && onSuccess) onSuccess(data);
  }, [data, onSuccess]);

  useEffect(() => {
    if (error && onError) onError(error as Error);
  }, [error, onError]);

  const stats: PNodeStats = {
    total: data?.length || 0,
    online: data?.filter((node: PNode) => isNodeOnline(node)).length || 0,
    offline: data?.filter((node: PNode) => !isNodeOnline(node)).length || 0,
    totalStorageCommitted: data?.reduce((sum: number, node: PNode) => sum + node.storage_committed, 0) || 0,
    totalStorageUsed: data?.reduce((sum: number, node: PNode) => sum + node.storage_used, 0) || 0,
    averageUptime: calculateAverageUptime(data || []),
    versions: getVersionDistribution(data || []),
  };

  return {
    pnodes: data || [],
    isLoading,
    isError,
    error: error as Error | null,
    isFetching,
    isStale,
    refetch,
    lastUpdated: dataUpdatedAt,
    stats,
  };
}

export function usePrefetchPNodes() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['pnodes'],
      queryFn: () => prpcClient.getPodsWithStats(),
      staleTime: 10000,
    });
  };
}

export function useInvalidatePNodes() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['pnodes'] });
  };
}

export function useUpdatePNodeCache() {
  const queryClient = useQueryClient();
  return (pubkey: string, updates: Partial<PNode>) => {
    queryClient.setQueryData<PNode[]>(['pnodes'], (old: PNode[] | undefined) => {
      if (!old) return old;
      return old.map((node: PNode) =>
        node.pubkey === pubkey ? { ...node, ...updates } : node
      );
    });
  };
}

function isNodeOnline(node: PNode): boolean {
  const now = Math.floor(Date.now() / 1000);
  const timeSinceLastSeen = now - node.last_seen_timestamp;
  return timeSinceLastSeen < 120;
}

function calculateAverageUptime(nodes: PNode[]): number {
  if (nodes.length === 0) return 0;
  const onlineNodes = nodes.filter(isNodeOnline);
  const totalUptime = onlineNodes.reduce((sum, node) => sum + node.uptime, 0);
  return totalUptime / onlineNodes.length;
}

function getVersionDistribution(nodes: PNode[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  nodes.forEach((node) => {
    const version = node.version || 'unknown';
    distribution[version] = (distribution[version] || 0) + 1;
  });
  return distribution;
}
