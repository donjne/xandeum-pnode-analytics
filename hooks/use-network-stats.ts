/*
 * Network statistics hook
 * Uses the zustand store which already has SDK data
 */

import { useNetworkStore } from '@/stores/networkStore';
import { PNode } from '@/lib/types/pnode';

export function useNetworkStats() {
  const { nodes, totalCount, onlineCount, totalStorage, usedStorage } = useNetworkStore();

  // Calculate additional stats from nodes
  const stats = {
    totalNodes: totalCount,
    onlineNodes: onlineCount,
    offlineNodes: totalCount - onlineCount,
    totalStorage,
    usedStorage,
    availableStorage: totalStorage - usedStorage,
    storageUtilization: totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0,
    
    // Version distribution
    versionDistribution: nodes.reduce((acc, node: PNode) => {
      const version = node.version || 'unknown';
      acc[version] = (acc[version] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    
    // Average uptime
    averageUptime: nodes.length > 0
      ? nodes.reduce((sum: number, node: PNode) => sum + (node.uptime || 0), 0) / nodes.length
      : 0,
    
    // Health distribution
    healthDistribution: {
      excellent: nodes.filter((node: PNode) => (node.health_score || 0) >= 90).length,
      good: nodes.filter((node: PNode) => (node.health_score || 0) >= 70 && (node.health_score || 0) < 90).length,
      fair: nodes.filter((node: PNode) => (node.health_score || 0) >= 50 && (node.health_score || 0) < 70).length,
      poor: nodes.filter((node: PNode) => (node.health_score || 0) < 50).length,
    },
    
    // Top performers
    topPerformers: [...nodes]
      .sort((a: PNode, b: PNode) => (b.health_score || 0) - (a.health_score || 0))
      .slice(0, 10),
  };

  return stats;
}