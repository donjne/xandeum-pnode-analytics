import { NextResponse } from 'next/server';
import { evaluateAlerts } from '@/lib/alerts/evaluate';

export async function GET() {
  try {
    const result = await evaluateAlerts();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Alert evaluation failed' },
      { status: 500 }
    );
  }
}
