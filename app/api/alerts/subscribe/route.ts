import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import clientPromise from '@/lib/mongodb';
import { generateToken, hashToken } from '@/lib/subscriptions';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const token = generateToken();
    const tokenHash = hashToken(token);

    const client = await clientPromise;
    const db = client.db('alerts');
    const collection = db.collection('email_subscriptions');

    // Prevent duplicate subscriptions
    const existing = await collection.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }

    await collection.insertOne({
      email,
      token_hash: tokenHash,
      created_at: Date.now(),
    });

    await resend.emails.send({
      from: 'Xandeum Alerts <alerts@xandeum.io>',
      to: email,
      subject: 'Xandeum Alerts Subscription',
      html: `
        <p>You are now subscribed to Xandeum alerts.</p>
        <p><strong>Your unsubscribe code (save this):</strong></p>
        <p style="font-size:18px;font-weight:bold;letter-spacing:1px">
          ${token}
        </p>
        <p>This code will not be shown again.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      token, // shown ONCE in modal
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
