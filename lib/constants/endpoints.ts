/**
 * API endpoint configurations
 */

/**
 * Get the base URL for pRPC calls
 * Can be overridden with environment variable
 */
export const getBaseRpcUrl = (ip?: string, port?: number): string => {
  const defaultIp = process.env.NEXT_PUBLIC_SEED_PNODE_IP || '109.199.96.218';
  const defaultPort = parseInt(process.env.NEXT_PUBLIC_RPC_PORT || '6000', 10);
  
  const targetIp = ip || defaultIp;
  const targetPort = port || defaultPort;
  
  return `http://${targetIp}:${targetPort}`;
};

/**
 * Get WebSocket URL for real-time updates
 */
export const getWebSocketUrl = (ip?: string, port?: number): string => {
  const defaultIp = process.env.NEXT_PUBLIC_SEED_PNODE_IP || '109.199.96.218';
  const defaultPort = parseInt(process.env.NEXT_PUBLIC_WS_PORT || '6001', 10);
  
  const targetIp = ip || defaultIp;
  const targetPort = port || defaultPort;
  
  return `ws://${targetIp}:${targetPort}/ws`;
};

/**
 * pRPC method endpoints - Re-export from prpc/methods
 */
export { PRPC_METHODS } from '../prpc/methods';

/**
 * Internal API routes (Next.js API routes)
 */
export const API_ROUTES = {
  // Proxy for pRPC calls
  PRPC_PROXY: '/api/prpc',
  
  // Health check
  HEALTH: '/api/health',
  
  // Analytics endpoints
  ANALYTICS: {
    NETWORK_STATS: '/api/analytics/network-stats',
    NODE_HISTORY: '/api/analytics/node-history',
    TRENDS: '/api/analytics/trends',
  },
  
  // Export endpoints
  EXPORT: {
    CSV: '/api/export/csv',
    JSON: '/api/export/json',
  },
} as const;

/**
 * External API endpoints
 */
export const EXTERNAL_APIS = {
  // Xandeum official APIs (when available)
  xandeum: {
    base: 'https://api.xandeum.network',
    pnodes: '/v1/pnodes',
    stats: '/v1/stats',
    version: '/v1/version',
  },
  
  // Fallback/mirror endpoints
  mirrors: [
    'https://api-backup.xandeum.network',
    'https://api-eu.xandeum.network',
  ],
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  // Requests per minute
  perMinute: {
    pRPC: 60,
    internalAPI: 120,
    export: 10,
  },
  
  // Burst allowance
  burst: {
    pRPC: 10,
    internalAPI: 20,
    export: 5,
  },
} as const;

/**
 * Request timeout configurations (milliseconds)
 */
export const TIMEOUTS = {
  prpc: 10000, // 10 seconds
  internalAPI: 30000, // 30 seconds
  export: 60000, // 60 seconds
  websocket: 5000, // 5 seconds for connection
} as const;

/**
 * Retry configurations
 */
export const RETRY_CONFIG = {
  attempts: 3,
  delay: 1000, // Initial delay in ms
  multiplier: 2, // Exponential backoff multiplier
  maxDelay: 10000, // Maximum delay in ms
  
  // Which HTTP status codes should trigger a retry
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
} as const;

/**
 * Cache configurations (milliseconds)
 */
export const CACHE_DURATIONS = {
  pnodes: 30000, // 30 seconds
  networkStats: 60000, // 1 minute
  nodeHistory: 300000, // 5 minutes
  static: 3600000, // 1 hour
} as const;

/**
 * Endpoint health status
 */
export interface EndpointHealth {
  url: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastChecked: number;
  errorCount: number;
}

/**
 * Endpoint utilities
 */
export const endpointUtils = {
  /**
   * Build pRPC request URL
   */
  buildRpcUrl: (method: string, ip?: string, port?: number): string => {
    const baseUrl = getBaseRpcUrl(ip, port);
    return `${baseUrl}/rpc`;
  },
  
  /**
   * Build pRPC request body
   */
  buildRpcRequest: (method: string, params?: any, id: number = 1) => ({
    jsonrpc: '2.0',
    method,
    params: params || {},
    id,
  }),
  
  /**
   * Check if status code is retryable
   */
  isRetryable: (statusCode: number): boolean => {
    return (RETRY_CONFIG.retryableStatusCodes as readonly number[]).includes(statusCode);
  },
  
  /**
   * Calculate retry delay with exponential backoff
   */
  calculateRetryDelay: (attempt: number): number => {
    const delay = RETRY_CONFIG.delay * Math.pow(RETRY_CONFIG.multiplier, attempt - 1);
    return Math.min(delay, RETRY_CONFIG.maxDelay);
  },
  
  /**
   * Parse pRPC response
   */
  parseRpcResponse: <T>(response: any): T => {
    if (response.error) {
      throw new Error(response.error.message || 'RPC error');
    }
    return response.result;
  },
};