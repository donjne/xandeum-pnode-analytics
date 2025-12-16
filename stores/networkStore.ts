import { create } from 'zustand';
import { PNode } from '@/lib/types/pnode';
import { prpcClient } from '@/lib/api/prpc-client';

interface NetworkState {
  nodes: PNode[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  
  // Computed values
  totalCount: number;
  onlineCount: number;
  totalStorage: number;
  usedStorage: number;
  
  // Actions
  fetchNodes: () => Promise<void>;
  refreshNodes: () => Promise<void>;
  getNodeByPubkey: (pubkey: string) => PNode | undefined;
  clearError: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  nodes: [],
  isLoading: false,
  error: null,
  lastUpdated: 0,
  
  // Computed values
  totalCount: 0,
  onlineCount: 0,
  totalStorage: 0,
  usedStorage: 0,
  
  fetchNodes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('🔄 Fetching nodes from xandeum-prpc SDK...');
      
      // Use SDK to fetch pods with stats
      const pods = await prpcClient.getPodsWithStats();
      
      if (!pods || pods.length === 0) {
        console.warn('⚠️  No pods returned from API');
        set({ 
          nodes: [],
          totalCount: 0,
          onlineCount: 0,
          totalStorage: 0,
          usedStorage: 0,
          isLoading: false,
          lastUpdated: Date.now(),
          error: 'No pNodes found in network'
        });
        return;
      }

      console.log(`✅ Received ${pods.length} pods from SDK`);

      // Transform SDK response to our PNode format (SDK uses snake_case)
      const nodes: PNode[] = pods.map((pod: any) => ({
        pubkey: pod.pubkey || 'unknown',
        address: pod.address || 'unknown',
        rpc_port: pod.rpc_port || 6000,
        is_public: pod.is_public ?? true,
        last_seen_timestamp: pod.last_seen_timestamp || 0,
        version: pod.version || '0.0.0',
        storage_committed: pod.storage_committed || 0,
        storage_used: pod.storage_used || 0,
        storage_usage_percent: pod.storage_usage_percent || 0,
        uptime: pod.uptime || 0,
        // Calculate online status (online if seen in last 5 minutes)
        status: (pod.last_seen_timestamp && (Date.now() / 1000 - pod.last_seen_timestamp) < 300) 
          ? 'online' as const
          : 'offline' as const,
      }));

      // Calculate aggregated stats
      const totalCount = nodes.length;
      const onlineCount = nodes.filter(n => n.status === 'online').length;
      const totalStorage = nodes.reduce((sum, n) => sum + n.storage_committed, 0);
      const usedStorage = nodes.reduce((sum, n) => sum + n.storage_used, 0);

      console.log(`📊 Stats: ${onlineCount}/${totalCount} online, ${(totalStorage / 1e9).toFixed(2)} GB total storage`);

      set({
        nodes,
        totalCount,
        onlineCount,
        totalStorage,
        usedStorage,
        isLoading: false,
        lastUpdated: Date.now(),
        error: null,
      });
    } catch (error: any) {
      console.error('❌ Failed to fetch nodes from SDK:', error);
      
      // NO MOCK DATA FALLBACK - just show error
      set({
        error: error.message || 'Failed to fetch pNodes from network',
        isLoading: false,
        nodes: [],
        totalCount: 0,
        onlineCount: 0,
        totalStorage: 0,
        usedStorage: 0,
      });
    }
  },

  refreshNodes: async () => {
    console.log('♻️  Refreshing nodes...');
    await get().fetchNodes();
  },

  getNodeByPubkey: (pubkey: string) => {
    return get().nodes.find((node) => node.pubkey === pubkey);
  },

  clearError: () => {
    set({ error: null });
  },
}));
