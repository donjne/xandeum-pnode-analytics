import { RETRY_CONFIG, TIMEOUTS } from '@/lib/constants/endpoints';
import { endpointUtils } from '@/lib/constants/endpoints';
import {
  JsonRpcRequest,
  JsonRpcResponse,
  PrpcClientConfig,
  PrpcRequestOptions,
  PrpcError,
  PrpcTimeoutError,
  PrpcNetworkError,
  PrpcMethodMap,
  PrpcMethod,
} from './types';
import {
  PRPC_METHODS,
  PrpcMethods,
  buildGetPodInfoParams,
  buildGetPodHealthParams,
  buildGetGossipPeersParams,
  buildGetStorageStatsParams,
} from './methods';

/**
 * Production-ready pRPC client
 * Handles communication with pNode RPC endpoints
 */
export class PrpcClient implements PrpcMethods {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;
  private requestId: number = 1;
  
  // Callbacks
  private onError?: (error: Error) => void;
  private onRequest?: (method: string, params?: any) => void;
  private onResponse?: (method: string, response: any) => void;

  constructor(config: PrpcClientConfig = {}) {
    this.baseUrl =
      config.baseUrl ||
      `http://${process.env.NEXT_PUBLIC_SEED_PNODE_IP || '109.199.96.218'}:${
        process.env.NEXT_PUBLIC_RPC_PORT || '6000'
      }`;
    this.timeout = config.timeout || TIMEOUTS.prpc;
    this.retryAttempts = config.retryAttempts || RETRY_CONFIG.attempts;
    this.retryDelay = config.retryDelay || RETRY_CONFIG.delay;
    
    this.onError = config.onError;
    this.onRequest = config.onRequest;
    this.onResponse = config.onResponse;
  }

  /**
   * Make a type-safe RPC call
   */
  private async call<M extends PrpcMethod>(
    method: M,
    params?: PrpcMethodMap[M]['request'],
    options: PrpcRequestOptions = {}
  ): Promise<PrpcMethodMap[M]['response']> {
    const id = this.requestId++;
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      params: params || {},
      id,
    };

    // Fire onRequest callback
    if (this.onRequest) {
      this.onRequest(method, params);
    }

    const timeout = options.timeout || this.timeout;
    const retryAttempts = options.retryAttempts ?? this.retryAttempts;

    let lastError: Error | null = null;

    // Retry loop
    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        const response = await this.makeRequest(request, timeout, options.signal);

        // Fire onResponse callback
        if (this.onResponse) {
          this.onResponse(method, response);
        }

        return response.result as PrpcMethodMap[M]['response'];
      } catch (error) {
        lastError = error as Error;

        // Don't retry on timeout from user signal or certain errors
        if (options.signal?.aborted) {
          throw error;
        }

        // Check if error is retryable
        if (error instanceof PrpcNetworkError && attempt < retryAttempts) {
          const delay = endpointUtils.calculateRetryDelay(attempt + 1);
          await this.sleep(delay);
          continue;
        }

        // Non-retryable error or last attempt
        if (this.onError) {
          this.onError(error as Error);
        }
        throw error;
      }
    }

    // Should never reach here, but TypeScript needs it
    throw lastError || new Error('Unknown error');
  }

  /**
   * Make the actual HTTP request
   */
  private async makeRequest(
    request: JsonRpcRequest,
    timeout: number,
    signal?: AbortSignal
  ): Promise<JsonRpcResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Combine signals
    const combinedSignal =
      signal && !signal.aborted
        ? this.combineSignals([signal, controller.signal])
        : controller.signal;

    try {
      const response = await fetch(`${this.baseUrl}/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new PrpcNetworkError(
          `HTTP ${response.status}: ${response.statusText}`,
          new Error(`HTTP ${response.status}`)
        );
      }

      const data = await response.json();

      // Check for JSON-RPC error
      if (data.error) {
        throw new PrpcError(data.error.message, data.error.code, data.error.data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new PrpcTimeoutError(request.method, timeout);
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new PrpcNetworkError('Network request failed', error);
      }

      // Re-throw PrpcError and custom errors
      throw error;
    }
  }

  /**
   * Combine multiple abort signals
   */
  private combineSignals(signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort();
        break;
      }
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    return controller.signal;
  }

  /**
   * Sleep utility for retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Test connection to pNode
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getPodsWithStats();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get connection health
   */
  async getConnectionHealth(): Promise<{
    connected: boolean;
    latency: number;
    error?: string;
  }> {
    const start = Date.now();
    try {
      await this.getPodsWithStats();
      const latency = Date.now() - start;
      return { connected: true, latency };
    } catch (error) {
      const latency = Date.now() - start;
      return {
        connected: false,
        latency,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ============================================================
  // Public API Methods
  // ============================================================

  /**
   * Get all pNodes with statistics
   */
  async getPodsWithStats() {
    return this.call(PRPC_METHODS.GET_PODS_WITH_STATS);
  }

  /**
   * Get detailed information about a specific pNode
   */
  async getPodInfo(pubkey: string) {
    return this.call(PRPC_METHODS.GET_POD_INFO, buildGetPodInfoParams(pubkey));
  }

  /**
   * Get health status for a specific pNode
   */
  async getPodHealth(pubkey: string) {
    return this.call(PRPC_METHODS.GET_POD_HEALTH, buildGetPodHealthParams(pubkey));
  }

  /**
   * Get gossip protocol peer connections
   */
  async getGossipPeers(pubkey?: string) {
    return this.call(PRPC_METHODS.GET_GOSSIP_PEERS, buildGetGossipPeersParams(pubkey));
  }

  /**
   * Get network-wide storage statistics
   */
  async getStorageStats(pubkey?: string) {
    return this.call(PRPC_METHODS.GET_STORAGE_STATS, buildGetStorageStatsParams(pubkey));
  }

  /**
   * Get version distribution across the network
   */
  async getVersionInfo() {
    return this.call(PRPC_METHODS.GET_VERSION_INFO);
  }

  /**
   * Update base URL (useful for switching seed nodes)
   */
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  /**
   * Get current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

/**
 * Create a default client instance
 */
export function createPrpcClient(config?: PrpcClientConfig): PrpcClient {
  return new PrpcClient(config);
}

/**
 * Singleton instance for easy use
 */
let defaultClient: PrpcClient | null = null;

export function getDefaultPrpcClient(): PrpcClient {
  if (!defaultClient) {
    defaultClient = createPrpcClient();
  }
  return defaultClient;
}

/**
 * Reset the default client (useful for testing)
 */
export function resetDefaultPrpcClient() {
  defaultClient = null;
}