import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getHeartbeatStats } from '@/lib/network/heartbeat';

export async function POST() {
  const client = await clientPromise;
  const db = client.db('analytics');
  const col = db.collection('heartbeat_daily');

  const today = new Date().toISOString().slice(0, 10);

  // Prevent duplicate snapshot
  const exists = await col.findOne({ date: today });
  if (exists) {
    return NextResponse.json({ skipped: true });
  }

  const stats = await getHeartbeatStats();
  const total = stats.success + stats.failed + stats.missed;

  const successRate =
    total === 0 ? 0 : (stats.success / total) * 100;

  await col.insertOne({
    date: today,
    success: stats.success,
    failed: stats.failed,
    missed: stats.missed,
    success_rate: successRate,
    created_at: Date.now(),
  });

  return NextResponse.json({ success: true });
}
