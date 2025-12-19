'use client';

import * as React from 'react';
import { useNetworkStore } from '@/stores/networkStore';

export function useNetworkReady() {
  const {
    nodes,
    isLoading,
    error,
    fetchNodes,
    lastUpdated,
  } = useNetworkStore();

  React.useEffect(() => {
    // If no data yet, fetch once
    if (!nodes || nodes.length === 0) {
      fetchNodes();
    }
  }, [nodes, fetchNodes]);

  return {
    nodes: Array.isArray(nodes) ? nodes : [],
    isLoading,
    error,
    lastUpdated,
    hasData: Array.isArray(nodes) && nodes.length > 0,
  };
}
