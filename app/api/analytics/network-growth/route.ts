import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const revalidate = 3600; // cache for 1 hour

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Math.min(
      parseInt(searchParams.get('days') || '30', 10),
      90
    );

    const client = await clientPromise;
    const db = client.db('analytics');
    const snapshots = db.collection('network_snapshots');

    const data = await snapshots
      .find({})
      .sort({ date: 1 })
      .limit(days)
      .toArray();

    return NextResponse.json(
      data.map((d) => ({
        date: d.date,
        total: d.totalNodes,
        online: d.onlineNodes,
        offline: d.offlineNodes,
      }))
    );
  } catch (err) {
    console.error('[network growth]', err);
    return NextResponse.json(
      { error: 'Failed to load network growth data' },
      { status: 500 }
    );
  }
}
