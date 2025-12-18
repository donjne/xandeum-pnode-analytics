'use client';

import { create } from 'zustand';
import { PNode } from '@/lib/types/pnode';

interface NetworkState {
  nodes: PNode[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;

  totalCount: number;
  onlineCount: number;
  totalStorage: number;
  usedStorage: number;

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

  totalCount: 0,
  onlineCount: 0,
  totalStorage: 0,
  usedStorage: 0,

  fetchNodes: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch('/api/network/nodes');
      if (!res.ok) throw new Error('Failed to fetch pNodes');

      const pods = await res.json();

      const nodes: PNode[] = pods.map((pod: any) => ({
        pubkey: pod.pubkey,
        address: pod.address,
        rpc_port: pod.rpc_port ?? 6000,
        is_public: pod.is_public ?? true,
        last_seen_timestamp: pod.last_seen_timestamp ?? 0,
        version: pod.version ?? '0.0.0',
        storage_committed: pod.storage_committed ?? 0,
        storage_used: pod.storage_used ?? 0,
        storage_usage_percent: pod.storage_usage_percent ?? 0,
        uptime: pod.uptime ?? 0,
        status:
          pod.last_seen_timestamp &&
          Date.now() / 1000 - pod.last_seen_timestamp < 300
            ? 'online'
            : 'offline',
      }));

      const totalCount = nodes.length;
      const onlineCount = nodes.filter(n => n.status === 'online').length;
      const totalStorage = nodes.reduce((s, n) => s + n.storage_committed, 0);
      const usedStorage = nodes.reduce((s, n) => s + n.storage_used, 0);

      set({
        nodes,
        totalCount,
        onlineCount,
        totalStorage,
        usedStorage,
        isLoading: false,
        lastUpdated: Date.now(),
      });
    } catch (err: any) {
      set({
        error: err.message ?? 'Failed to fetch pNodes',
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
    await get().fetchNodes();
  },

  getNodeByPubkey: (pubkey: string) =>
    get().nodes.find(n => n.pubkey === pubkey),

  clearError: () => set({ error: null }),
}));
