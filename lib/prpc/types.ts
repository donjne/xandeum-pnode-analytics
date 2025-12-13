/**
 * JSON-RPC 2.0 base types
 */

export interface JsonRpcRequest<T = any> {
  jsonrpc: '2.0';
  method: string;
  params?: T;
  id: number | string;
}

export interface JsonRpcResponse<T = any> {
  jsonrpc: '2.0';
  result?: T;
  error?: JsonRpcError;
  id: number | string;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: any;
}

/**
 * pRPC specific types
 */

export interface PodWithStats {
  address: string;
  is_public: boolean;
  last_seen_timestamp: number;
  pubkey: string;
  rpc_port: number;
  storage_committed: number;
  storage_usage_percent: number;
  storage_used: number;
  uptime: number;
  version: string;
}

export interface GetPodsWithStatsResponse {
  pods: PodWithStats[];
  timestamp?: number;
}

export interface GetPodInfoRequest {
  pubkey: string;
}

export interface GetPodInfoResponse {
  pod: PodWithStats;
  connections?: number;
  last_heartbeat?: number;
}

export interface GetPodHealthRequest {
  pubkey: string;
}

export interface GetPodHealthResponse {
  pubkey: string;
  health_score: number;
  status: 'online' | 'offline' | 'degraded';
  uptime_percentage: number;
  last_seen: number;
}

export interface GetGossipPeersRequest {
  pubkey?: string;
}

export interface GossipPeer {
  pubkey: string;
  address: string;
  last_contact: number;
  latency?: number;
}

export interface GetGossipPeersResponse {
  peers: GossipPeer[];
  total: number;
}

export interface GetStorageStatsRequest {
  pubkey?: string;
}

export interface GetStorageStatsResponse {
  total_committed: number;
  total_used: number;
  total_available: number;
  utilization_percentage: number;
  nodes_by_usage?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface GetVersionInfoResponse {
  current_version: string;
  latest_version: string;
  update_available: boolean;
  versions: {
    version: string;
    node_count: number;
    percentage: number;
  }[];
}

/**
 * Request types for type safety
 */
export type PrpcMethod =
  | 'get-pods-with-stats'
  | 'get-pod-info'
  | 'get-pod-health'
  | 'get-gossip-peers'
  | 'get-storage-stats'
  | 'get-version-info';

/**
 * Typed request/response map
 */
export interface PrpcMethodMap {
  'get-pods-with-stats': {
    request: undefined;
    response: GetPodsWithStatsResponse;
  };
  'get-pod-info': {
    request: GetPodInfoRequest;
    response: GetPodInfoResponse;
  };
  'get-pod-health': {
    request: GetPodHealthRequest;
    response: GetPodHealthResponse;
  };
  'get-gossip-peers': {
    request: GetGossipPeersRequest;
    response: GetGossipPeersResponse;
  };
  'get-storage-stats': {
    request: GetStorageStatsRequest;
    response: GetStorageStatsResponse;
  };
  'get-version-info': {
    request: undefined;
    response: GetVersionInfoResponse;
  };
}

/**
 * Client configuration
 */
export interface PrpcClientConfig {
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  onRequest?: (method: string, params?: any) => void;
  onResponse?: (method: string, response: any) => void;
}

/**
 * Request options
 */
export interface PrpcRequestOptions {
  timeout?: number;
  retryAttempts?: number;
  signal?: AbortSignal;
}

/**
 * Error types
 */
export class PrpcError extends Error {
  constructor(
    message: string,
    public code: number,
    public data?: any
  ) {
    super(message);
    this.name = 'PrpcError';
  }
}

export class PrpcTimeoutError extends Error {
  constructor(method: string, timeout: number) {
    super(`Request to ${method} timed out after ${timeout}ms`);
    this.name = 'PrpcTimeoutError';
  }
}

export class PrpcNetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'PrpcNetworkError';
  }
}