import { useEffect } from 'react';
import { useNetworkStore } from '@/stores/networkStore';
import { useAppStore } from '@/stores/appStore';

export function useNetwork() {
  const network = useNetworkStore();
  const { settings } = useAppStore();

  useEffect(() => {
    if (network.nodes.length === 0) {
      network.fetchNodes();
    }
  }, []);

  useEffect(() => {
    if (!settings.autoRefresh) return;

    const id = setInterval(
      network.refreshNodes,
      settings.refreshInterval
    );

    return () => clearInterval(id);
  }, [settings.autoRefresh, settings.refreshInterval]);

  return network;
}

export function useNode(pubkey: string) {
  const { nodes, isLoading, getNodeByPubkey, fetchNodes } =
    useNetworkStore();

  useEffect(() => {
    if (nodes.length === 0) fetchNodes();
  }, [nodes.length]);

  const node = getNodeByPubkey(pubkey);

  return {
    node,
    isLoading: isLoading || (!node && nodes.length === 0),
    notFound: !isLoading && nodes.length > 0 && !node,
  };
}
