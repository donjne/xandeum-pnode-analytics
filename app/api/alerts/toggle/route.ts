import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('alerts');

    const alert = await db
      .collection('alert_definitions')
      .findOne({ _id: id });

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    await db.collection('alert_definitions').updateOne(
      { _id: id },
      {
        $set: {
          enabled: !alert.enabled,
          updatedAt: Date.now(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to toggle alert' },
      { status: 500 }
    );
  }
}
