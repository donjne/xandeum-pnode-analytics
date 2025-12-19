import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const required = ['name', 'condition', 'severity'];
    for (const key of required) {
      if (!data[key]) {
        return NextResponse.json(
          { error: `Missing ${key}` },
          { status: 400 }
        );
      }
    }

    const client = await clientPromise;
    const db = client.db('alerts');

    const now = Date.now();

    const alert = {
      ...data,
      enabled: true,
      createdAt: now,
      updatedAt: now,
      lastTriggered: null,
    };

    await db.collection('alert_definitions').insertOne(alert);

    return NextResponse.json({ success: true, alert });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}
