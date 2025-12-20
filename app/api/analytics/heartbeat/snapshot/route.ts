import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getHeartbeatStats } from '@/lib/network/heartbeat'

function todayUTC() {
  return new Date().toISOString().slice(0, 10)
}

export async function POST() {
  const client = await clientPromise
  const db = client.db('analytics')
  const collection = db.collection('heartbeat_snapshots')

  const date = todayUTC()

  const exists = await collection.findOne({ date })
  if (exists) {
    return NextResponse.json({ skipped: true })
  }

  const stats = await getHeartbeatStats()

  await collection.insertOne({
    date,
    ...stats,
    created_at: Date.now(),
  })

  return NextResponse.json({ success: true })
}
