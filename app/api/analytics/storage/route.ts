import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getAllNodes } from '@/lib/network/nodes'

function todayUTC() {
  return new Date().toISOString().slice(0, 10)
}

export async function POST() {
  const client = await clientPromise
  const db = client.db('analytics')
  const collection = db.collection('storage_snapshots')

  const date = todayUTC()

  // Prevent duplicate snapshot
  const exists = await collection.findOne({ date })
  if (exists) {
    return NextResponse.json({ skipped: true })
  }

  const nodes = await getAllNodes()

  let totalCommitted = 0
  let totalUsed = 0

  for (const node of nodes) {
    totalCommitted += node.storage_committed ?? 0
    totalUsed += node.storage_used ?? 0
  }

  const utilization =
    totalCommitted === 0
      ? 0
      : (totalUsed / totalCommitted) * 100

  await collection.insertOne({
    date,
    total_committed: totalCommitted,
    total_used: totalUsed,
    utilization,
    node_count: nodes.length,
    created_at: Date.now(),
  })

  return NextResponse.json({ success: true })
}
