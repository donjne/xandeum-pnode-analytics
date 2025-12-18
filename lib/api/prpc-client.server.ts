/**
 * Xandeum pRPC Client – SERVER ONLY
 * Never import this file in client components or stores
 */

import { PrpcClient } from 'xandeum-prpc';

const SEED_IPS = [
  '173.212.220.65',
  '161.97.97.41',
  '192.190.136.36',
  '192.190.136.38',
  '207.244.255.1',
  '192.190.136.28',
  '192.190.136.29',
  '173.212.203.145',
];

const DEFAULT_SEED = SEED_IPS[0];

function createClient(seed = DEFAULT_SEED) {
  return new PrpcClient(seed, { timeout: 10_000 });
}

export async function fetchPodsWithStats() {
  const client = createClient();
  const res = await client.getPodsWithStats();
  return res?.pods ?? [];
}

export async function findPNode(pubkey: string) {
  return PrpcClient.findPNode(pubkey);
}
