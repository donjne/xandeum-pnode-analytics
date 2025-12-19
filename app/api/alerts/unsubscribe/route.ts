import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashToken } from '@/lib/subscriptions';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);

    const client = await clientPromise;
    const db = client.db('alerts');
    const collection = db.collection('email_subscriptions');

    const result = await collection.findOneAndDelete({
    token_hash: tokenHash,
    });

    if (!result || !result.value) {
    return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
    );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
