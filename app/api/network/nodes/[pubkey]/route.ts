import { findPNode } from '@/lib/api/prpc-client.server';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { pubkey: string } }
) {
  try {
    const node = await findPNode(params.pubkey);
    return NextResponse.json(node);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
