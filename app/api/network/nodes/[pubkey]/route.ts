import { findPNode } from '@/lib/api/prpc-client.server';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  context: { params: Promise<{ pubkey: string }> }
) {
  try {
    const { pubkey } = await context.params;

    const node = await findPNode(pubkey);
    return NextResponse.json(node);
  } catch {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }
}
