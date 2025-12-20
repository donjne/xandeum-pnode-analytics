import clientPromise from '@/lib/mongodb';

const HEARTBEAT_INTERVAL_SECONDS = 30;
const DAILY_EXPECTED = (24 * 60 * 60) / HEARTBEAT_INTERVAL_SECONDS;

export async function getHeartbeatStats() {
  const client = await clientPromise;
  const db = client.db('network');
  const nodes = await db.collection('nodes').find({}).toArray();

  let success = 0;
  let failed = 0;
  let missed = 0;

  const now = Date.now() / 1000;

  for (const node of nodes) {
    const lastSeen = node.last_seen_timestamp ?? 0;
    const delta = now - lastSeen;

    if (delta <= HEARTBEAT_INTERVAL_SECONDS * 2) {
      success += DAILY_EXPECTED;
    } else if (delta <= HEARTBEAT_INTERVAL_SECONDS * 10) {
      failed += DAILY_EXPECTED;
    } else {
      missed += DAILY_EXPECTED;
    }
  }

  return {
    success: Math.floor(success),
    failed: Math.floor(failed),
    missed: Math.floor(missed),
  };
}
