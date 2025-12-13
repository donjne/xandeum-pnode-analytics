import { useQuery } from '@tanstack/react-query';
import { PNode } from '@/lib/types/pnode';
import { prpcClient } from '@/lib/api/prpc-client';

export interface UsePNodeOptions {
  enabled?: boolean;
  refetchInterval?: number;
  useCache?: boolean;
}

export interface UsePNodeResult {
  pNode: PNode | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch a single pNode by pubkey
 * By default, tries to use cached data from the main pNodes query
 * Set useCache=false to fetch directly from the network
 */
export function usePNode(
  pubkey: string | undefined,
  options: UsePNodeOptions = {}
): UsePNodeResult {
  const { enabled = true, refetchInterval, useCache = true } = options;
  
  // Only fetch if enabled and pubkey exists
  const shouldFetch = enabled && !!pubkey;
  
  const query = useQuery<PNode, Error>({
    queryKey: ['pnode', pubkey],
    queryFn: async () => {
      if (!pubkey) throw new Error('No pubkey provided');
      
      // For direct fetch, we need to get all nodes and filter
      // This is because pRPC doesn't have a single-node endpoint
      const allNodes = await prpcClient.getPodsWithStats();
      const node = allNodes.find((n: PNode) => n.pubkey === pubkey);
      
      if (!node) {
        throw new Error(`Node with pubkey ${pubkey} not found`);
      }
      
      return node;
    },
    enabled: shouldFetch,
    refetchInterval,
    staleTime: 20000,
    retry: 2,
  });
  
  return {
    pNode: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to get historical data for a pNode (simulated for now)
 * In production, this would fetch from a time-series database
 */
export interface PNodeHistoricalData {
  timestamp: number;
  uptime: number;
  storage_used: number;
  storage_usage_percent: number;
  is_online: boolean;
}

export function usePNodeHistory(
  pubkey: string | undefined,
  timeRange: '1h' | '24h' | '7d' | '30d' = '24h'
): {
  history: PNodeHistoricalData[];
  isLoading: boolean;
  isError: boolean;
} {
  const { pNode } = usePNode(pubkey);
  
  // Generate mock historical data based on current state
  // In production, this would fetch real historical data
  const history: PNodeHistoricalData[] = [];
  
  if (pNode) {
    const now = Date.now();
    const intervals = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    const intervalMs = timeRange === '1h' ? 5 * 60 * 1000 : 60 * 60 * 1000;
    
    for (let i = intervals; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      
      // Add some realistic variance
      const uptimeVariance = Math.random() * 100;
      const storageVariance = Math.random() * 0.1 - 0.05; // ±5%
      
      history.push({
        timestamp,
        uptime: Math.max(0, pNode.uptime - uptimeVariance),
        storage_used: Math.max(
          0,
          pNode.storage_used * (1 + storageVariance)
        ),
        storage_usage_percent: Math.max(
          0,
          Math.min(100, pNode.storage_usage_percent * (1 + storageVariance))
        ),
        is_online: Math.random() > 0.05, // 95% uptime
      });
    }
  }
  
  return {
    history,
    isLoading: false,
    isError: false,
  };
}

/**
 * Hook to get pNode health score
 * Calculates a 0-100 score based on multiple factors
 */
export function usePNodeHealth(pubkey: string | undefined): {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  factors: {
    uptime: number;
    storage: number;
    version: number;
    responsiveness: number;
  };
} {
  const { pNode } = usePNode(pubkey);
  
  if (!pNode) {
    return {
      score: 0,
      rating: 'poor',
      factors: {
        uptime: 0,
        storage: 0,
        version: 0,
        responsiveness: 0,
      },
    };
  }
  
  const now = Date.now();
  const lastSeenMs = pNode.last_seen_timestamp * 1000;
  const timeSinceLastSeen = now - lastSeenMs;
  
  // Calculate individual factor scores (0-100)
  const uptimeScore = Math.min(100, (pNode.uptime / (24 * 60 * 60)) * 100);
  
  const storageScore = pNode.storage_usage_percent < 80
    ? 100
    : pNode.storage_usage_percent < 90
    ? 70
    : pNode.storage_usage_percent < 95
    ? 40
    : 20;
  
  // Version score (assume 0.7.3 is latest)
  const versionScore = pNode.version === '0.7.3'
    ? 100
    : pNode.version === '0.7.2'
    ? 80
    : pNode.version === '0.7.1'
    ? 60
    : 40;
  
  // Responsiveness score based on last seen time
  const responsivenessScore = timeSinceLastSeen < 30000
    ? 100
    : timeSinceLastSeen < 60000
    ? 70
    : timeSinceLastSeen < 120000
    ? 40
    : 0;
  
  // Weighted average
  const score = Math.round(
    uptimeScore * 0.3 +
    storageScore * 0.2 +
    versionScore * 0.2 +
    responsivenessScore * 0.3
  );
  
  // Determine rating
  const rating: 'excellent' | 'good' | 'fair' | 'poor' =
    score >= 90
      ? 'excellent'
      : score >= 70
      ? 'good'
      : score >= 50
      ? 'fair'
      : 'poor';
  
  return {
    score,
    rating,
    factors: {
      uptime: uptimeScore,
      storage: storageScore,
      version: versionScore,
      responsiveness: responsivenessScore,
    },
  };
}

/**
 * Hook to compare multiple pNodes
 */
export function useComparePNodes(pubkeys: string[]): {
  nodes: (PNode | null)[];
  isLoading: boolean;
} {
  const queries = pubkeys.map((pubkey) => usePNode(pubkey));
  
  return {
    nodes: queries.map((q) => q.pNode),
    isLoading: queries.some((q) => q.isLoading),
  };
}