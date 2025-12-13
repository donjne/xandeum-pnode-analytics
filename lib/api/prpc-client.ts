/**
 * pRPC API Client
 * 
 * Handles all communication with pNode RPC endpoints.
 * Uses Next.js API routes as proxy to avoid CORS issues.
 */

import { PNode } from '@/lib/types/pnode';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/prpc';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Error types
export class PRPCError extends Error {
  constructor(
    message: string,
    public code?: number,
    public method?: string
  ) {
    super(message);
    this.name = 'PRPCError';
  }
}

// Generic RPC request function
async function rpcRequest<T>(
  method: string,
  params: any = {},
  options: { timeout?: number; endpoint?: string } = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, endpoint } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method,
        params,
        endpoint,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new PRPCError(
        error.error || `HTTP ${response.status}: ${response.statusText}`,
        error.code,
        method
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new PRPCError(`Request timeout after ${timeout}ms`, 504, method);
    }

    if (error instanceof PRPCError) {
      throw error;
    }

    throw new PRPCError(error.message || 'Unknown error', undefined, method);
  }
}

// Alternative: Use dynamic route (more RESTful)
async function rpcRequestDynamic<T>(
  method: string,
  params: any = {},
  options: { timeout?: number; endpoint?: string } = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, endpoint } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Convert method to URL path (e.g., 'get-pods' -> '/api/prpc/get/pods')
  const path = method.replace(/-/g, '/');
  const url = new URL(`${API_BASE_URL}/${path}`, window.location.origin);
  
  if (endpoint) {
    url.searchParams.set('endpoint', endpoint);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ params }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new PRPCError(
        error.error || `HTTP ${response.status}: ${response.statusText}`,
        error.code,
        method
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new PRPCError(`Request timeout after ${timeout}ms`, 504, method);
    }

    if (error instanceof PRPCError) {
      throw error;
    }

    throw new PRPCError(error.message || 'Unknown error', undefined, method);
  }
}

// =============================================================================
// pRPC Methods
// =============================================================================

/**
 * Get all pNodes in gossip network
 */
export async function getPods(endpoint?: string): Promise<PNode[]> {
  const result = await rpcRequest<{ pods: any[] }>('get-pods', {}, { endpoint });
  
  // Transform raw pRPC response to our PNode type
  return result.pods.map((pod: any) => ({
    pubkey: pod.pubkey,
    address: pod.address,
    rpc_port: pod.rpc_port,
    is_public: pod.is_public,
    version: pod.version,
    uptime: pod.uptime,
    storage_committed: pod.storage_committed,
    storage_used: pod.storage_used || 0,
    storage_usage_percent: pod.storage_usage_percent || 0,
    last_seen_timestamp: pod.last_seen_timestamp,
    // Calculate derived fields
    status: (Date.now() / 1000 - pod.last_seen_timestamp < 120 ? 'online' : 'offline') as 'online' | 'offline',
    health_score: calculateHealthScore(pod),
  } as PNode));
}

/**
 * Get pNodes with detailed statistics
 */
export async function getPodsWithStats(endpoint?: string): Promise<PNode[]> {
  const result = await rpcRequest<{ pods: any[] }>('get-pods-with-stats', {}, { endpoint });
  
  return result.pods.map((pod: any) => ({
    pubkey: pod.pubkey,
    address: pod.address,
    rpc_port: pod.rpc_port,
    is_public: pod.is_public,
    version: pod.version,
    uptime: pod.uptime,
    storage_committed: pod.storage_committed,
    storage_used: pod.storage_used || 0,
    storage_usage_percent: pod.storage_usage_percent || 0,
    last_seen_timestamp: pod.last_seen_timestamp,
    status: (Date.now() / 1000 - pod.last_seen_timestamp < 120 ? 'online' : 'offline') as 'online' | 'offline',
    health_score: calculateHealthScore(pod),
  } as PNode));
}

/**
 * Get specific pNode by pubkey
 */
export async function getPodByPubkey(
  pubkey: string,
  endpoint?: string
): Promise<PNode | null> {
  try {
    const result = await rpcRequest<{ pod: any }>(
      'get-pod-by-pubkey',
      { pubkey },
      { endpoint }
    );
    
    if (!result.pod) {
      return null;
    }

    const pod = result.pod;
    return {
      pubkey: pod.pubkey,
      address: pod.address,
      rpc_port: pod.rpc_port,
      is_public: pod.is_public,
      version: pod.version,
      uptime: pod.uptime,
      storage_committed: pod.storage_committed,
      storage_used: pod.storage_used || 0,
      storage_usage_percent: pod.storage_usage_percent || 0,
      last_seen_timestamp: pod.last_seen_timestamp,
      status: (Date.now() / 1000 - pod.last_seen_timestamp < 120 ? 'online' : 'offline') as 'online' | 'offline',
      health_score: calculateHealthScore(pod),
    } as PNode;
  } catch (error) {
    console.error('Failed to fetch pod by pubkey:', error);
    return null;
  }
}

/**
 * Get pNode statistics
 */
export async function getPodStats(
  pubkey: string,
  endpoint?: string
): Promise<any> {
  return rpcRequest('get-pod-stats', { pubkey }, { endpoint });
}

/**
 * Get gossip connections for a pNode
 */
export async function getGossipPeers(
  pubkey: string,
  endpoint?: string
): Promise<any[]> {
  const result = await rpcRequest<{ peers: any[] }>(
    'get-gossip-peers',
    { pubkey },
    { endpoint }
  );
  return result.peers || [];
}

/**
 * Get heartbeat history for a pNode
 */
export async function getHeartbeatHistory(
  pubkey: string,
  hours: number = 24,
  endpoint?: string
): Promise<any[]> {
  const result = await rpcRequest<{ history: any[] }>(
    'get-heartbeat-history',
    { pubkey, hours },
    { endpoint }
  );
  return result.history || [];
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate health score from pod data
 */
function calculateHealthScore(pod: any): number {
  let score = 100;

  // Deduct for being offline
  const lastSeenSeconds = Date.now() / 1000 - pod.last_seen_timestamp;
  if (lastSeenSeconds > 300) score -= 50; // 5 minutes
  else if (lastSeenSeconds > 120) score -= 20; // 2 minutes
  else if (lastSeenSeconds > 60) score -= 10; // 1 minute

  // Deduct for high storage usage
  const usagePercent = pod.storage_usage_percent || 0;
  if (usagePercent > 95) score -= 20;
  else if (usagePercent > 90) score -= 10;
  else if (usagePercent > 80) score -= 5;

  // Deduct for low uptime
  if (pod.uptime < 3600) score -= 10; // Less than 1 hour

  return Math.max(0, Math.min(100, score));
}

/**
 * Batch fetch multiple pNodes
 */
export async function batchGetPods(
  pubkeys: string[],
  endpoint?: string
): Promise<(PNode | null)[]> {
  return Promise.all(pubkeys.map((pubkey) => getPodByPubkey(pubkey, endpoint)));
}

/**
 * Health check for pRPC endpoint
 */
export async function healthCheck(endpoint?: string): Promise<boolean> {
  try {
    const url = endpoint
      ? `${endpoint}/health`
      : `${API_BASE_URL.replace('/prpc', '/prpc/health')}`;
    
    const response = await fetch(url, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}

// Export default client
export const prpcClient = {
  getPods,
  getPodsWithStats,
  getPodByPubkey,
  getPodStats,
  getGossipPeers,
  getHeartbeatHistory,
  batchGetPods,
  healthCheck,
};

export default prpcClient;