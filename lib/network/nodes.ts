import clientPromise from '@/lib/mongodb'
import { PNode } from '@/lib/types'

export async function getAllNodes(): Promise<PNode[]> {
  const client = await clientPromise
  const db = client.db('network')

  return db.collection<PNode>('nodes').find({}).toArray()
}
