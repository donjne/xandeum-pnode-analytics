/**
 * Xandeum pRPC Client using official xandeum-prpc SDK
 * NO MORE AXIOS. NO MORE BROKEN API ROUTES.
 */

import { PrpcClient as XandeumPrpcClient } from 'xandeum-prpc';

// Seed pNode IPs from the SDK defaults
const SEED_IPS = [
  "173.212.220.65",
  "161.97.97.41", 
  "192.190.136.36",
  "192.190.136.38",
  "207.244.255.1",
  "192.190.136.28",
  "192.190.136.29",
  "173.212.203.145"
];

const DEFAULT_SEED_IP = SEED_IPS[0];

/**
 * Wrapper around xandeum-prpc SDK
 */
class PRPCClient {
  private client: XandeumPrpcClient;
  private currentSeed: string;

  constructor(seedIp: string = DEFAULT_SEED_IP) {
    this.currentSeed = seedIp;
    this.client = new XandeumPrpcClient(seedIp, { timeout: 10000 });
    console.log(`[SDK] Initialized with seed: ${seedIp}`);
  }

  /**
   * Get all pods with detailed statistics
   * This is what we use in the store!
   */
  async getPodsWithStats() {
    try {
      console.log(`[SDK] Calling getPodsWithStats() from ${this.currentSeed}...`);
      const response = await this.client.getPodsWithStats();
      console.log(`[SDK] ✅ Got ${response.total_count} pods`);
      return response.pods || [];
    } catch (error) {
      console.error('[SDK] ❌ getPodsWithStats failed:', error);
      throw error;
    }
  }

  /**
   * Get basic pods list (less data)
   */
  async getPods() {
    try {
      console.log(`[SDK] Calling getPods() from ${this.currentSeed}...`);
      const response = await this.client.getPods();
      console.log(`[SDK] ✅ Got ${response.total_count} pods`);
      return response.pods || [];
    } catch (error) {
      console.error('[SDK] ❌ getPods failed:', error);
      throw error;
    }
  }

  /**
   * Get stats for current node
   */
  async getStats() {
    try {
      console.log(`[SDK] Calling getStats() from ${this.currentSeed}...`);
      const stats = await this.client.getStats();
      console.log(`[SDK] ✅ Got node stats`);
      return stats;
    } catch (error) {
      console.error('[SDK] ❌ getStats failed:', error);
      throw error;
    }
  }

  /**
   * Find a specific pNode by public key
   */
  static async findPNode(pubkey: string, options?: {
    addSeeds?: string[];
    replaceSeeds?: string[];
    timeout?: number;
  }) {
    try {
      console.log(`[SDK] Finding pNode ${pubkey}...`);
      const pod = await XandeumPrpcClient.findPNode(pubkey, options);
      console.log(`[SDK] ✅ Found pNode at ${pod.address}`);
      return pod;
    } catch (error) {
      console.error(`[SDK] ❌ Failed to find pNode ${pubkey}:`, error);
      throw error;
    }
  }

  /**
   * Try multiple seeds until one works
   */
  static async createWithFallback(seeds: string[] = SEED_IPS): Promise<PRPCClient> {
    for (const seed of seeds) {
      try {
        const client = new PRPCClient(seed);
        // Test connection
        await client.getPods();
        console.log(`[SDK] ✅ Connected to seed ${seed}`);
        return client;
      } catch (error) {
        console.warn(`[SDK] ⚠️  Seed ${seed} failed, trying next...`);
        continue;
      }
    }
    throw new Error('All seed nodes failed');
  }
}

// Export singleton instance
export const prpcClient = new PRPCClient();

// Export class for custom instances
export { PRPCClient };

// Export seed IPs
export { SEED_IPS };
