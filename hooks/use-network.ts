import { useEffect } from 'react';
import { useNetworkStore } from '@/stores/networkStore';
import { useAppStore } from '@/stores/appStore';

/**
 * Hook to manage network data fetching and auto-refresh
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const { nodes, isLoading, error } = useNetwork();
 *   
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error} />;
 *   
 *   return <div>{nodes.length} nodes</div>;
 * }
 * ```
 */
export function useNetwork() {
  const networkState = useNetworkStore();
  const { settings } = useAppStore();
  
  // Initial fetch
  useEffect(() => {
    if (networkState.nodes.length === 0) {
      networkState.fetchNodes();
    }
  }, []);
  
  // Auto-refresh based on settings
  useEffect(() => {
    if (!settings.autoRefresh) return;
    
    const interval = setInterval(() => {
      networkState.refreshNodes();
    }, settings.refreshInterval);
    
    return () => clearInterval(interval);
  }, [settings.autoRefresh, settings.refreshInterval]);
  
  return networkState;
}

/**
 * Hook to fetch a specific node by pubkey
 */
export function useNode(pubkey: string) {
  const { nodes, isLoading, getNodeByPubkey } = useNetworkStore();
  
  // Ensure nodes are loaded
  useEffect(() => {
    if (nodes.length === 0) {
      useNetworkStore.getState().fetchNodes();
    }
  }, [nodes.length]);
  
  const node = getNodeByPubkey(pubkey);
  
  return {
    node,
    isLoading: isLoading || (!node && nodes.length === 0),
    notFound: !isLoading && nodes.length > 0 && !node,
  };
}