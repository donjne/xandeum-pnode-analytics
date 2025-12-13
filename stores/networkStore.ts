import { create } from 'zustand';
import { PNode } from '@/lib/types/pnode';
import { prpcClient, PRPCError } from '@/lib/api/prpc-client';
import { generateMockNodes } from '@/lib/mock-data';

interface NetworkState {
  nodes: PNode[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  useMockData: boolean; // Toggle between mock and real data
  
  // Computed values
  totalCount: number;
  onlineCount: number;
  totalStorage: number;
  usedStorage: number;
  
  // Actions
  fetchNodes: () => Promise<void>;
  refreshNodes: () => Promise<void>;
  getNodeByPubkey: (pubkey: string) => PNode | undefined;
  toggleMockData: (useMock: boolean) => void;
  clearError: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  nodes: [],
  isLoading: false,
  error: null,
  lastUpdated: 0,
  useMockData: false, // Start with mock data, set to false for real API
  
  // Computed values
  totalCount: 0,
  onlineCount: 0,
  totalStorage: 0,
  usedStorage: 0,
  
  fetchNodes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      let nodes: PNode[];
      
      if (get().useMockData) {
        // Mock data (for development/demo)
        await new Promise((resolve) => setTimeout(resolve, 500));
        nodes = generateMockNodes(100);
      } else {
        // Real API call
        try {
          console.log('Fetching nodes from pRPC API...');
          nodes = await prpcClient.getPodsWithStats();
          
          // Fallback to basic getPods if getPodsWithStats fails
          if (!nodes || nodes.length === 0) {
            console.log('No stats available, trying basic getPods...');
            nodes = await prpcClient.getPods();
          }
          
          console.log(`Successfully fetched ${nodes.length} nodes`);
        } catch (apiError) {
          console.error('API call failed:', apiError);
          
          // Fallback to mock data if API fails
          nodes = generateMockNodes(100);
          
          // Set error but don't throw - allow UI to render with mock data
          if (apiError instanceof PRPCError) {
            set({ 
              error: `API Error: ${apiError.message} (code: ${apiError.code}). Using mock data.`,
            });
          } else {
            set({ 
              error: 'Failed to connect to pRPC endpoint. Using mock data.',
            });
          }
        }
      }
      
      // Calculate computed values
      const onlineCount = nodes.filter((n) => n.status === 'online').length;
      const totalStorage = nodes.reduce((sum, n) => sum + n.storage_committed, 0);
      const usedStorage = nodes.reduce((sum, n) => sum + n.storage_used, 0);
      
      set({
        nodes,
        totalCount: nodes.length,
        onlineCount,
        totalStorage,
        usedStorage,
        isLoading: false,
        lastUpdated: Date.now(),
      });
    } catch (error: any) {
      console.error('Unexpected error in fetchNodes:', error);
      set({
        error: error.message || 'Failed to fetch nodes',
        isLoading: false,
      });
    }
  },
  
  refreshNodes: async () => {
    await get().fetchNodes();
  },
  
  getNodeByPubkey: (pubkey: string) => {
    return get().nodes.find((node) => node.pubkey === pubkey);
  },
  
  toggleMockData: (useMock: boolean) => {
    set({ useMockData: useMock, error: null });
    get().fetchNodes(); // Refetch with new mode
  },
  
  clearError: () => {
    set({ error: null });
  },
}));