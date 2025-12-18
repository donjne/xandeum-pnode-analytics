import { NextResponse } from 'next/server';

type GeoResult = {
  lat: number;
  lng: number;
  country: string;
  city: string;
};

// simple in-memory cache (safe for your use case)
const cache = new Map<string, GeoResult>();

// hard cap — total successful lookups
let successfulLookups = 0;
const MAX_LOOKUPS = 2;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ip = searchParams.get('ip');

  if (!ip) {
    return NextResponse.json({ error: 'Missing IP' }, { status: 400 });
  }

  // return cached immediately
  if (cache.has(ip)) {
    return NextResponse.json(cache.get(ip));
  }

  // hard stop — no more external calls
  if (successfulLookups >= MAX_LOOKUPS) {
    return NextResponse.json(
      { error: 'Lookup limit reached' },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'XandeumAnalytics/1.0',
      },
      // do NOT retry
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Geo lookup failed' },
        { status: 200 }
      );
    }

    const data = await res.json();

    if (!data.latitude || !data.longitude) {
      return NextResponse.json(
        { error: 'Incomplete geo data' },
        { status: 200 }
      );
    }

    const result: GeoResult = {
      lat: data.latitude,
      lng: data.longitude,
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
    };

    cache.set(ip, result);
    successfulLookups += 1;

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Geo lookup error' },
      { status: 200 }
    );
  }
}
