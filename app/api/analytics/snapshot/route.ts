import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

/**
 * Runs DAILY via Vercel cron
 * Freezes network state into MongoDB
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('analytics');
    const snapshots = db.collection('network_snapshots');

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // 1️⃣ Prevent duplicate snapshots
    const existing = await snapshots.findOne({ date: today });
    if (existing) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: 'Snapshot already exists for today',
      });
    }

    // 2️⃣ Fetch live network data
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/network/nodes`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch live network data');
    }

    const nodes = await res.json();

    // 3️⃣ Aggregate metrics
    let online = 0;
    let offline = 0;
    let totalStorage = 0;
    let usedStorage = 0;
    const versions: Record<string, number> = {};

    for (const node of nodes) {
      if (node.status === 'online') online++;
      else offline++;

      totalStorage += node.storage_committed ?? 0;
      usedStorage += node.storage_used ?? 0;

      const version = node.version ?? 'unknown';
      versions[version] = (versions[version] || 0) + 1;
    }

    // 4️⃣ Insert snapshot
    await snapshots.insertOne({
      date: today,
      timestamp: Date.now(),

      totalNodes: nodes.length,
      onlineNodes: online,
      offlineNodes: offline,

      totalStorage,
      usedStorage,

      versions,

      createdAt: Date.now(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[analytics snapshot]', err);
    return NextResponse.json(
      { error: 'Failed to create analytics snapshot' },
      { status: 500 }
    );
  }
}
