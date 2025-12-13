/**
 * Core pNode data structure from pRPC get-pods-with-stats response
 */
export interface PNode {
  address: string; // "109.199.96.218:9001"
  is_public: boolean;
  last_seen_timestamp: number; // Unix timestamp in seconds
  pubkey: string; // Base58 encoded public key
  rpc_port: number; // Usually 6000
  storage_committed: number; // Bytes
  storage_usage_percent: number; // 0-100
  storage_used: number; // Bytes
  uptime: number; // Seconds
  version: string; // "0.7.3"
  
  // Calculated fields (added by client)
  status?: 'online' | 'offline';
  health_score?: number; // 0-100
}

/**
 * Extended pNode information with calculated fields
 */
export interface PNodeExtended extends PNode {
  // Calculated fields
  isOnline: boolean;
  timeSinceLastSeen: number; // Seconds
  healthScore: number; // 0-100
  healthCategory: 'excellent' | 'good' | 'fair' | 'poor';
  storageAvailable: number; // Bytes
  
  // Optional user data
  nickname?: string;
  notes?: string;
  isMonitored?: boolean;
}

/**
 * Network-wide pNode statistics
 */
export interface PNodeStats {
  total: number;
  online: number;
  offline: number;
  totalStorageCommitted: number;
  totalStorageUsed: number;
  averageUptime: number;
  versions: Record<string, number>;
}

/**
 * pNode filter criteria
 */
export interface PNodeFilter {
  searchQuery?: string;
  status?: 'all' | 'online' | 'offline';
  version?: string;
  minStorageUsage?: number;
  maxStorageUsage?: number;
  minHealthScore?: number;
  maxHealthScore?: number;
  minUptime?: number;
}

/**
 * pNode sorting options
 */
export interface PNodeSort {
  field: 'uptime' | 'credits' | 'storage' | 'lastSeen' | 'version' | 'health' | 'pubkey';
  order: 'asc' | 'desc';
}

/**
 * Gossip connection information
 */
export interface GossipConnection {
  pubkey: string;
  address: string;
  latency?: number; // Milliseconds
  lastContact: number; // Unix timestamp
}

/**
 * pNode performance metrics over time
 */
export interface PNodeMetrics {
  timestamp: number;
  uptime: number;
  storageUsed: number;
  storageUsagePercent: number;
  isOnline: boolean;
  healthScore: number;
}

/**
 * pNode historical data
 */
export interface PNodeHistory {
  pubkey: string;
  metrics: PNodeMetrics[];
  firstSeen: number;
  lastSeen: number;
}

/**
 * Credit and reward information
 */
export interface PNodeCredits {
  pubkey: string;
  baseCredits: number;
  boostMultiplier: number;
  totalCredits: number;
  epochCredits: number;
  eraBoost?: EraBoost;
  nftBoost?: NFTBoost;
}

/**
 * Era boost information
 */
export type EraBoost = {
  era: 'Deep South' | 'South' | 'Mine' | 'Coal' | 'Central' | 'North';
  multiplier: number;
};

/**
 * NFT boost information
 */
export type NFTBoost = {
  type: 'Titan' | 'Dragon' | 'Coyote' | 'Rabbit' | 'Cricket' | 'Xeno';
  multiplier: number;
};

/**
 * Reward calculation result
 */
export interface RewardCalculation {
  baseCredits: number;
  boostMultiplier: number;
  totalCredits: number;
  networkShare: number; // Percentage
  estimatedRewardsPerEpoch: number; // XAND
  estimatedRewardsMonthly: number; // XAND
  estimatedRewardsAnnual: number; // XAND
}

/**
 * Version information
 */
export interface VersionInfo {
  version: string;
  count: number;
  percentage: number;
  isLatest: boolean;
}