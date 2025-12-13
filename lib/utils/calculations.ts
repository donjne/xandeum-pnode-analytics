import { ERA_BOOSTS, NFT_BOOSTS, EraBoostName, NFTBoostName } from '@/lib/constants/boosts';
import { PNode } from '@/lib/types/pnode';

/**
 * Calculate health score for a pNode (0-100)
 */
export function calculateHealthScore(node: PNode, currentTimestamp?: number): number {
  const now = currentTimestamp || Math.floor(Date.now() / 1000);
  let score = 100;
  
  // Time since last seen (0-30 points penalty)
  const timeSinceLastSeen = now - node.last_seen_timestamp;
  if (timeSinceLastSeen > 120) {
    // Offline (> 2 minutes)
    return 0;
  } else if (timeSinceLastSeen > 60) {
    score -= 15;
  } else if (timeSinceLastSeen > 30) {
    score -= 5;
  }
  
  // Storage usage (0-20 points penalty)
  if (node.storage_usage_percent < 5) {
    score -= 10; // Too low usage
  } else if (node.storage_usage_percent > 95) {
    score -= 15; // Critical - almost full
  } else if (node.storage_usage_percent > 90) {
    score -= 5; // High usage warning
  }
  
  // Version check (0-20 points penalty)
  const latestVersion = '0.7.3';
  if (node.version !== latestVersion) {
    const versionDiff = compareVersions(node.version, latestVersion);
    if (versionDiff < -1) {
      score -= 20; // Multiple versions behind
    } else if (versionDiff < 0) {
      score -= 10; // One version behind
    }
  }
  
  // Uptime bonus (0-5 points)
  if (node.uptime > 86400) {
    // More than 24 hours
    score = Math.min(100, score + 5);
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get health category from score
 */
export function getHealthCategory(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

/**
 * Compare two version strings
 * Returns: positive if v1 > v2, negative if v1 < v2, 0 if equal
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map((n) => parseInt(n, 10) || 0);
  const parts2 = v2.split('.').map((n) => parseInt(n, 10) || 0);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 !== num2) {
      return num1 - num2;
    }
  }
  
  return 0;
}

/**
 * Check if node is online
 */
export function isNodeOnline(node: PNode, threshold: number = 120): boolean {
  const now = Math.floor(Date.now() / 1000);
  const timeSinceLastSeen = now - node.last_seen_timestamp;
  return timeSinceLastSeen < threshold;
}

/**
 * Calculate base credits for a pNode
 * Formula: (number of pNodes) × (storage provided) × (performance score) × (stake amount)
 * Simplified version for display purposes
 */
export function calculateBaseCredits(
  storageCommitted: number,
  performanceScore: number = 100,
  stakeAmount: number = 1
): number {
  // Normalize storage to TB
  const storageTB = storageCommitted / (1024 * 1024 * 1024 * 1024);
  
  // Base calculation
  const baseCredits = storageTB * (performanceScore / 100) * stakeAmount;
  
  return Math.round(baseCredits * 100); // Scale up for better numbers
}

/**
 * Calculate combined boost multiplier
 */
export function calculateBoostMultiplier(
  eraBoost: EraBoostName | null,
  nftBoost: NFTBoostName | null
): number {
  const era = eraBoost ? ERA_BOOSTS[eraBoost].multiplier : 1;
  const nft = nftBoost ? NFT_BOOSTS[nftBoost].multiplier : 1;
  return era * nft;
}

/**
 * Calculate boosted credits
 */
export function calculateBoostedCredits(
  baseCredits: number,
  eraBoost: EraBoostName | null,
  nftBoost: NFTBoostName | null
): number {
  const multiplier = calculateBoostMultiplier(eraBoost, nftBoost);
  return Math.round(baseCredits * multiplier);
}

/**
 * Calculate network share percentage
 */
export function calculateNetworkShare(
  nodeCredits: number,
  totalNetworkCredits: number
): number {
  if (totalNetworkCredits === 0) return 0;
  return (nodeCredits / totalNetworkCredits) * 100;
}

/**
 * Calculate estimated rewards
 */
export interface RewardEstimate {
  perEpoch: number;
  perMonth: number;
  perYear: number;
  networkShare: number;
}

export function calculateRewards(
  nodeCredits: number,
  totalNetworkCredits: number,
  monthlyRewardPool: number = 10000
): RewardEstimate {
  const networkShare = calculateNetworkShare(nodeCredits, totalNetworkCredits);
  const perMonth = (networkShare / 100) * monthlyRewardPool;
  
  // Assuming 30 epochs per month (2 days per epoch)
  const perEpoch = perMonth / 30;
  const perYear = perMonth * 12;
  
  return {
    perEpoch: Math.round(perEpoch * 100) / 100,
    perMonth: Math.round(perMonth * 100) / 100,
    perYear: Math.round(perYear * 100) / 100,
    networkShare: Math.round(networkShare * 100) / 100,
  };
}

/**
 * Calculate storage utilization
 */
export function calculateStorageUtilization(
  storageUsed: number,
  storageCommitted: number
): number {
  if (storageCommitted === 0) return 0;
  return (storageUsed / storageCommitted) * 100;
}

/**
 * Calculate available storage
 */
export function calculateAvailableStorage(
  storageCommitted: number,
  storageUsed: number
): number {
  return Math.max(0, storageCommitted - storageUsed);
}

/**
 * Calculate uptime percentage
 */
export function calculateUptimePercentage(
  currentUptime: number,
  totalPossibleUptime: number = 86400
): number {
  if (totalPossibleUptime === 0) return 0;
  return Math.min(100, (currentUptime / totalPossibleUptime) * 100);
}

/**
 * Calculate average of an array of numbers
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

/**
 * Calculate median of an array of numbers
 */
export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
}

/**
 * Calculate percentile
 */
export function calculatePercentile(numbers: number[], percentile: number): number {
  if (numbers.length === 0) return 0;
  if (percentile < 0 || percentile > 100) {
    throw new Error('Percentile must be between 0 and 100');
  }
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (lower === upper) {
    return sorted[lower];
  }
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate credit threshold for rewards (80% of 95th percentile)
 */
export function calculateCreditThreshold(allNodeCredits: number[]): number {
  const percentile95 = calculatePercentile(allNodeCredits, 95);
  return percentile95 * 0.8;
}

/**
 * Check if node qualifies for rewards
 */
export function qualifiesForRewards(
  nodeCredits: number,
  allNodeCredits: number[]
): boolean {
  const threshold = calculateCreditThreshold(allNodeCredits);
  return nodeCredits >= threshold;
}

/**
 * Calculate growth rate percentage
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate compound annual growth rate (CAGR)
 */
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue === 0 || years === 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}