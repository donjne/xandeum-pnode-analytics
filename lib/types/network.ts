import { PNode } from './pnode';

/**
 * Comprehensive network statistics
 */
export interface NetworkStats {
  // Node counts
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  onlinePercentage: number;
  
  // Storage statistics
  totalStorageCommitted: number; // Bytes
  totalStorageUsed: number; // Bytes
  totalStorageAvailable: number; // Bytes
  averageStorageUtilization: number; // Percentage
  storageUtilizationByRange: StorageUtilizationRange[];
  
  // Version statistics
  versions: Record<string, number>;
  latestVersion: string;
  nodesOnLatestVersion: number;
  updateAdoptionRate: number; // Percentage
  versionDistribution: VersionDistribution[];
  
  // Performance statistics
  averageUptime: number; // Seconds
  medianUptime: number; // Seconds
  totalNetworkUptime: number; // Seconds
  nodesWithPerfectUptime: number;
  
  // Health statistics
  healthyNodes: number; // Score >= 70
  unhealthyNodes: number; // Score < 70
  networkHealthScore: number; // 0-100
  healthDistribution: HealthDistribution;
  
  // Geographic statistics
  uniqueRegions: number;
  regionDistribution?: RegionDistribution[];
  
  // Trend statistics (24h, 7d)
  growthRate24h?: number;
  growthRate7d?: number;
  
  // Timestamp
  lastUpdated: number;
}

/**
 * Storage utilization by range
 */
export interface StorageUtilizationRange {
  range: string; // "0-25%", "25-50%", etc.
  count: number;
  percentage: number;
}

/**
 * Version distribution details
 */
export interface VersionDistribution {
  version: string;
  count: number;
  percentage: number;
  isLatest: boolean;
}

/**
 * Health score distribution
 */
export interface HealthDistribution {
  excellent: number; // 90-100
  good: number; // 70-89
  fair: number; // 50-69
  poor: number; // 0-49
}

/**
 * Geographic distribution
 */
export interface RegionDistribution {
  region: string;
  country?: string;
  count: number;
  percentage: number;
}

/**
 * Network activity event
 */
export interface NetworkEvent {
  id: string;
  type: 'node_joined' | 'node_left' | 'version_update' | 'storage_alert' | 'network_milestone';
  timestamp: number;
  message: string;
  data?: any;
  severity?: 'info' | 'warning' | 'error';
}

/**
 * Network growth metrics
 */
export interface NetworkGrowth {
  timestamp: number;
  totalNodes: number;
  onlineNodes: number;
  totalStorage: number;
  averageHealth: number;
}

/**
 * Network performance over time
 */
export interface NetworkPerformance {
  timestamp: number;
  averageUptime: number;
  networkHealthScore: number;
  onlinePercentage: number;
  storageUtilization: number;
}

/**
 * Heartbeat statistics
 */
export interface HeartbeatStats {
  totalHeartbeats: number;
  successfulHeartbeats: number;
  failedHeartbeats: number;
  successRate: number; // Percentage
  averageLatency: number; // Milliseconds
}

/**
 * Network topology information
 */
export interface NetworkTopology {
  nodes: TopologyNode[];
  connections: TopologyConnection[];
}

/**
 * Topology node representation
 */
export interface TopologyNode {
  id: string;
  pubkey: string;
  address: string;
  isOnline: boolean;
  healthScore: number;
  connections: number;
}

/**
 * Topology connection representation
 */
export interface TopologyConnection {
  source: string; // pubkey
  target: string; // pubkey
  strength: number; // 0-1
  latency?: number; // Milliseconds
}

/**
 * Network comparison over time periods
 */
export interface NetworkComparison {
  current: NetworkStats;
  previous24h?: Partial<NetworkStats>;
  previous7d?: Partial<NetworkStats>;
  previous30d?: Partial<NetworkStats>;
}

/**
 * Network alert thresholds
 */
export interface NetworkThresholds {
  minOnlinePercentage: number;
  maxAverageStorageUtilization: number;
  minNetworkHealthScore: number;
  maxVersionFragmentation: number; // Different versions
}

/**
 * Network status
 */
export type NetworkStatus = 'healthy' | 'degraded' | 'critical' | 'unknown';

/**
 * Network health assessment
 */
export interface NetworkHealth {
  status: NetworkStatus;
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
}