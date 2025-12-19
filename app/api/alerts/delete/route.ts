import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('alerts');

    await db.collection('alert_definitions').deleteOne({ _id: id });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}
