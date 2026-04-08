import { Pinecone } from '@pinecone-database/pinecone'

let pc: Pinecone | null = null

export function getPineconeClient(): Pinecone {
  if (!pc) pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
  return pc
}

export function getTransactionsIndex() {
  return getPineconeClient().index(process.env.PINECONE_INDEX_NAME ?? 'monylink-transactions')
}
