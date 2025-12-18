import { fetchPodsWithStats } from '@/lib/api/prpc-client.server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pods = await fetchPodsWithStats();
    return NextResponse.json(pods);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Failed to fetch pNodes' },
      { status: 500 }
    );
  }
}
