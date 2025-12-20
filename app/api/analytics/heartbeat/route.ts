import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  const client = await clientPromise
  const db = client.db('analytics')

  const data = await db
    .collection('heartbeat_snapshots')
    .find({})
    .sort({ date: 1 })
    .limit(90)
    .toArray()

  return NextResponse.json(data)
}
