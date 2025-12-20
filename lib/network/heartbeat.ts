import clientPromise from '@/lib/mongodb'
import { PNode } from '@/lib/types'

interface HeartbeatStats {
  success: number
  failed: number
  missed: number
  success_rate: number
  node_count: number
}

/**
 * Derives heartbeat stats from node last_seen timestamps.
 * This keeps logic consistent across cron + UI.
 */
export async function getHeartbeatStats(): Promise<HeartbeatStats> {
  const client = await clientPromise
  const db = client.db('network')

  const nodes = await db.collection<PNode>('nodes').find({}).toArray()
  const now = Math.floor(Date.now() / 1000)

  let success = 0
  let failed = 0
  let missed = 0

  for (const node of nodes) {
    if (!node.last_seen_timestamp) {
      missed++
      continue
    }

    const delta = now - node.last_seen_timestamp

    if (delta <= 60) {
      success++
    } else if (delta <= 300) {
      failed++
    } else {
      missed++
    }
  }

  const total = success + failed + missed
  const success_rate = total === 0 ? 0 : (success / total) * 100

  return {
    success,
    failed,
    missed,
    success_rate,
    node_count: nodes.length,
  }
}
