import {
  GetPodsWithStatsResponse,
  GetPodInfoRequest,
  GetPodInfoResponse,
  GetPodHealthRequest,
  GetPodHealthResponse,
  GetGossipPeersRequest,
  GetGossipPeersResponse,
  GetStorageStatsRequest,
  GetStorageStatsResponse,
  GetVersionInfoResponse,
} from './types';

/**
 * pRPC method definitions
 * These match the actual pNode RPC interface
 */

export const PRPC_METHODS = {
  GET_PODS_WITH_STATS: 'get-pods-with-stats',
  GET_POD_INFO: 'get-pod-info',
  GET_POD_HEALTH: 'get-pod-health',
  GET_GOSSIP_PEERS: 'get-gossip-peers',
  GET_STORAGE_STATS: 'get-storage-stats',
  GET_VERSION_INFO: 'get-version-info',
} as const;

/**
 * Method descriptions for documentation
 */
export const METHOD_DESCRIPTIONS = {
  [PRPC_METHODS.GET_PODS_WITH_STATS]:
    'Get all pNodes visible in gossip network with their statistics',
  [PRPC_METHODS.GET_POD_INFO]: 'Get detailed information about a specific pNode',
  [PRPC_METHODS.GET_POD_HEALTH]: 'Get health status and score for a specific pNode',
  [PRPC_METHODS.GET_GOSSIP_PEERS]: 'Get gossip protocol peer connections',
  [PRPC_METHODS.GET_STORAGE_STATS]: 'Get network-wide storage statistics',
  [PRPC_METHODS.GET_VERSION_INFO]: 'Get version distribution across the network',
} as const;

/**
 * Type-safe method call signatures
 */

export interface PrpcMethods {
  /**
   * Get all pNodes with their statistics
   * This is the primary method for retrieving pNode data
   */
  getPodsWithStats(): Promise<GetPodsWithStatsResponse>;

  /**
   * Get detailed information about a specific pNode
   * @param pubkey - The public key of the pNode
   */
  getPodInfo(pubkey: string): Promise<GetPodInfoResponse>;

  /**
   * Get health status for a specific pNode
   * @param pubkey - The public key of the pNode
   */
  getPodHealth(pubkey: string): Promise<GetPodHealthResponse>;

  /**
   * Get gossip protocol peer connections
   * @param pubkey - Optional: filter by specific pNode
   */
  getGossipPeers(pubkey?: string): Promise<GetGossipPeersResponse>;

  /**
   * Get network-wide storage statistics
   * @param pubkey - Optional: get stats for specific pNode
   */
  getStorageStats(pubkey?: string): Promise<GetStorageStatsResponse>;

  /**
   * Get version distribution across the network
   */
  getVersionInfo(): Promise<GetVersionInfoResponse>;
}

/**
 * Method parameter builders
 * These help construct valid request parameters
 */

export function buildGetPodInfoParams(pubkey: string): GetPodInfoRequest {
  return { pubkey };
}

export function buildGetPodHealthParams(pubkey: string): GetPodHealthRequest {
  return { pubkey };
}

export function buildGetGossipPeersParams(pubkey?: string): GetGossipPeersRequest {
  return pubkey ? { pubkey } : {};
}

export function buildGetStorageStatsParams(pubkey?: string): GetStorageStatsRequest {
  return pubkey ? { pubkey } : {};
}

/**
 * Response validators
 * Check if responses match expected structure
 */

export function isGetPodsWithStatsResponse(data: any): data is GetPodsWithStatsResponse {
  return (
    data &&
    Array.isArray(data.pods) &&
    data.pods.every(
      (pod: any) =>
        typeof pod === 'object' &&
        typeof pod.pubkey === 'string' &&
        typeof pod.address === 'string' &&
        typeof pod.uptime === 'number'
    )
  );
}

export function isGetPodInfoResponse(data: any): data is GetPodInfoResponse {
  return data && typeof data.pod === 'object' && typeof data.pod.pubkey === 'string';
}

export function isGetPodHealthResponse(data: any): data is GetPodHealthResponse {
  return (
    data &&
    typeof data.pubkey === 'string' &&
    typeof data.health_score === 'number' &&
    typeof data.status === 'string'
  );
}

export function isGetGossipPeersResponse(data: any): data is GetGossipPeersResponse {
  return (
    data &&
    Array.isArray(data.peers) &&
    typeof data.total === 'number' &&
    data.peers.every(
      (peer: any) =>
        typeof peer === 'object' &&
        typeof peer.pubkey === 'string' &&
        typeof peer.address === 'string'
    )
  );
}

export function isGetStorageStatsResponse(data: any): data is GetStorageStatsResponse {
  return (
    data &&
    typeof data.total_committed === 'number' &&
    typeof data.total_used === 'number' &&
    typeof data.utilization_percentage === 'number'
  );
}

export function isGetVersionInfoResponse(data: any): data is GetVersionInfoResponse {
  return (
    data &&
    typeof data.current_version === 'string' &&
    typeof data.latest_version === 'string' &&
    typeof data.update_available === 'boolean' &&
    Array.isArray(data.versions)
  );
}