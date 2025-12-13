import { PNode } from '@/lib/types/pnode';

/**
 * Generate mock pNode data for development and testing
 */
export function generateMockNodes(count: number = 100): PNode[] {
  const versions = ['0.7.3', '0.7.2', '0.7.1', '0.7.0', '0.6.0'];
  const nodes: PNode[] = [];
  
  for (let i = 0; i < count; i++) {
    const lastSeenSeconds = Math.random() * 300; // 0-5 minutes ago
    const lastSeenTimestamp = Math.floor(Date.now() / 1000 - lastSeenSeconds);
    const isOnline = lastSeenSeconds < 120;
    
    const storageCommitted = Math.floor(Math.random() * 1000000000000); // Up to 1TB
    const storageUsagePercent = Math.random() * 100;
    const storageUsed = Math.floor((storageCommitted * storageUsagePercent) / 100);
    
    const uptime = Math.floor(Math.random() * 30 * 24 * 3600); // Up to 30 days
    
    // Calculate health score
    let healthScore = 100;
    if (!isOnline) healthScore -= 50;
    if (storageUsagePercent > 95) healthScore -= 20;
    else if (storageUsagePercent > 90) healthScore -= 10;
    if (uptime < 3600) healthScore -= 10;
    healthScore = Math.max(0, Math.min(100, healthScore));
    
    nodes.push({
      pubkey: generateRandomPubkey(),
      address: generateRandomIP(),
      rpc_port: 6000,
      is_public: Math.random() > 0.1,
      version: versions[Math.floor(Math.random() * versions.length)],
      uptime,
      storage_committed: storageCommitted,
      storage_used: storageUsed,
      storage_usage_percent: storageUsagePercent,
      last_seen_timestamp: lastSeenTimestamp,
      status: isOnline ? 'online' : 'offline',
      health_score: healthScore,
    });
  }
  
  return nodes;
}

function generateRandomPubkey(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomIP(): string {
  const ip = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  const port = 9000 + Math.floor(Math.random() * 100);
  return `${ip}:${port}`;
}