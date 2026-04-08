import { getTransactionsIndex } from './client'

const COUNTRY_MAP: Record<string, number> = { CM: 0.1, GA: 0.2, FR: 0.3, BE: 0.4, CH: 0.5, DE: 0.6 }
const METHOD_MAP: Record<string, number> = { orange_money: 0.1, mtn_momo: 0.2, wave: 0.3, mpesa: 0.4, airtel: 0.5 }

function buildVector(tx: { amount_eur: number; country: string; method: string; timestamp: number }): number[] {
  const date = new Date(tx.timestamp)
  return [
    Math.min(tx.amount_eur / 5000, 1),
    date.getHours() / 24,
    date.getDay() / 7,
    COUNTRY_MAP[tx.country] ?? 0.9,
    METHOD_MAP[tx.method] ?? 0.9,
    0, 0, 0,
  ]
}

export async function storeTransactionPattern(txId: string, tx: {
  userId: string; amount_eur: number; country: string; method: string; timestamp: number
}) {
  try {
    const index = getTransactionsIndex()
    await index.upsert({
      records: [{
        id: txId,
        values: buildVector(tx),
        metadata: { userId: tx.userId, amount_eur: tx.amount_eur, country: tx.country, method: tx.method },
      }],
    })
  } catch (e) {
    console.error('Pinecone storeTransactionPattern error:', e)
  }
}

export async function detectAnomaly(tx: {
  userId: string; amount_eur: number; country: string; method: string; timestamp: number
}, threshold = 0.3): Promise<{ isAnomaly: boolean; score: number }> {
  try {
    const index = getTransactionsIndex()
    const results = await index.query({
      vector: buildVector(tx),
      topK: 5,
      filter: { userId: { '$eq': tx.userId } },
      includeMetadata: true,
    })
    if (!results.matches.length) return { isAnomaly: false, score: 0 }
    const avg = results.matches.reduce((s, m) => s + (m.score ?? 0), 0) / results.matches.length
    const score = 1 - avg
    return { isAnomaly: score > threshold, score }
  } catch (e) {
    console.error('Pinecone detectAnomaly error:', e)
    return { isAnomaly: false, score: 0 }
  }
}
