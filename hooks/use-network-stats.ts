import { useMemo } from 'react';
import { usePNodes } from './use-pnodes';
import { PNode } from '@/lib/types/pnode';

export interface NetworkStats {
  // Basic counts
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  onlinePercentage: number;

  // Storage stats
  totalStorageCommitted: number;
  totalStorageUsed: number;
  averageStorageUtilization: number;
  totalStorageAvailable: number;

  // Version distribution
  versions: Record<string, number>;
  latestVersion: string;
  nodesOnLatestVersion: number;
  updateAdoptionRate: number;

  // Performance
  averageUptime: number;
  medianUptime: number;
  totalNetworkUptime: number;
  nodesWithPerfectUptime: number;

  // Health
  healthyNodes: number; // Score >= 70
  unhealthyNodes: number; // Score < 70
  networkHealthScore: number; // 0-100
  
  // Geographic (if available)
  uniqueRegions: number;
  
  // Trends (requires historical data - placeholder for now)
  growthRate24h?: number;
  growthRate7d?: number;
}

export function useNetworkStats(): NetworkStats {
  const { pnodes, stats: basicStats } = usePNodes();

  const detailedStats = useMemo(() => {
    if (!pnodes.length) {
      return {
        totalNodes: 0,
        onlineNodes: 0,
        offlineNodes: 0,
        onlinePercentage: 0,
        totalStorageCommitted: 0,
        totalStorageUsed: 0,
        averageStorageUtilization: 0,
        totalStorageAvailable: 0,
        versions: {},
        latestVersion: '0.7.3',
        nodesOnLatestVersion: 0,
        updateAdoptionRate: 0,
        averageUptime: 0,
        medianUptime: 0,
        totalNetworkUptime: 0,
        nodesWithPerfectUptime: 0,
        healthyNodes: 0,
        unhealthyNodes: 0,
        networkHealthScore: 0,
        uniqueRegions: 0,
      };
    }

    // Online/Offline counts
    const now = Math.floor(Date.now() / 1000);
    const onlineNodes = pnodes.filter((node) => now - node.last_seen_timestamp < 120);
    const offlineNodes = pnodes.filter((node) => now - node.last_seen_timestamp >= 120);

    // Storage calculations
    const totalStorageCommitted = pnodes.reduce((sum, node) => sum + node.storage_committed, 0);
    const totalStorageUsed = pnodes.reduce((sum, node) => sum + node.storage_used, 0);
    const totalStorageAvailable = totalStorageCommitted - totalStorageUsed;
    const averageStorageUtilization =
      onlineNodes.length > 0
        ? onlineNodes.reduce((sum, node) => sum + node.storage_usage_percent, 0) / onlineNodes.length
        : 0;

    // Version distribution
    const versions: Record<string, number> = {};
    pnodes.forEach((node) => {
      const version = node.version || 'unknown';
      versions[version] = (versions[version] || 0) + 1;
    });

    const latestVersion = getLatestVersion(Object.keys(versions));
    const nodesOnLatestVersion = versions[latestVersion] || 0;
    const updateAdoptionRate = (nodesOnLatestVersion / pnodes.length) * 100;

    // Uptime calculations
    const uptimes = onlineNodes.map((node) => node.uptime).sort((a, b) => a - b);
    const totalNetworkUptime = uptimes.reduce((sum, uptime) => sum + uptime, 0);
    const averageUptime = uptimes.length > 0 ? totalNetworkUptime / uptimes.length : 0;
    const medianUptime = uptimes.length > 0 ? uptimes[Math.floor(uptimes.length / 2)] : 0;
    
    // Perfect uptime (> 23 hours)
    const nodesWithPerfectUptime = onlineNodes.filter((node) => node.uptime > 82800).length;

    // Health calculations
    const nodeHealthScores = pnodes.map((node) => calculateNodeHealth(node, now));
    const healthyNodes = nodeHealthScores.filter((score) => score >= 70).length;
    const unhealthyNodes = nodeHealthScores.filter((score) => score < 70).length;
    const networkHealthScore =
      nodeHealthScores.length > 0
        ? nodeHealthScores.reduce((sum, score) => sum + score, 0) / nodeHealthScores.length
        : 0;

    // Geographic diversity (basic - from IP uniqueness)
    const uniqueIPs = new Set(pnodes.map((node) => node.address.split(':')[0])).size;
    const uniqueRegions = Math.ceil(uniqueIPs * 0.7); // Estimate

    return {
      totalNodes: pnodes.length,
      onlineNodes: onlineNodes.length,
      offlineNodes: offlineNodes.length,
      onlinePercentage: (onlineNodes.length / pnodes.length) * 100,
      totalStorageCommitted,
      totalStorageUsed,
      averageStorageUtilization,
      totalStorageAvailable,
      versions,
      latestVersion,
      nodesOnLatestVersion,
      updateAdoptionRate,
      averageUptime,
      medianUptime,
      totalNetworkUptime,
      nodesWithPerfectUptime,
      healthyNodes,
      unhealthyNodes,
      networkHealthScore,
      uniqueRegions,
    };
  }, [pnodes]);

  return detailedStats;
}

/**
 * Calculate health score for a single node
 */
function calculateNodeHealth(node: PNode, currentTimestamp: number): number {
  let score = 100;

  const timeSinceLastSeen = currentTimestamp - node.last_seen_timestamp;
  if (timeSinceLastSeen > 120) return 0; // Offline
  if (timeSinceLastSeen > 60) score -= 15;
  else if (timeSinceLastSeen > 30) score -= 5;

  if (node.storage_usage_percent < 5) score -= 10;
  else if (node.storage_usage_percent > 95) score -= 15;
  else if (node.storage_usage_percent > 90) score -= 5;

  const latestVersion = '0.7.3';
  if (node.version !== latestVersion) {
    const versionDiff = compareVersions(node.version, latestVersion);
    if (versionDiff < -1) score -= 20;
    else if (versionDiff < 0) score -= 10;
  }

  if (node.uptime > 86400) score = Math.min(100, score + 5);

  return Math.max(0, Math.min(100, score));
}

/**
 * Get the latest version from a list of versions
 */
function getLatestVersion(versions: string[]): string {
  const validVersions = versions.filter((v) => v !== 'unknown' && /^\d+\.\d+\.\d+/.test(v));
  if (validVersions.length === 0) return '0.7.3';

  return validVersions.sort((a, b) => compareVersions(b, a))[0];
}

/**
 * Compare two version strings
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map((n) => parseInt(n, 10) || 0);
  const parts2 = v2.split('.').map((n) => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 !== num2) return num1 - num2;
  }

  return 0;
}