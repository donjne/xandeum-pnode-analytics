import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('alerts');

    const alerts = await db
      .collection('alert_definitions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ alerts });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to load alerts' },
      { status: 500 }
    );
  }
}
