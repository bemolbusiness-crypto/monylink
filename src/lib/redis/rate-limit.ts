import { getRedis } from './client'
import { NextResponse } from 'next/server'

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const redis = getRedis()
  // Redis non configuré → laisser passer (pas de rate-limit en dev / sandbox)
  if (!redis) return true

  const now = Date.now()
  const windowKey = `ratelimit:${key}:${Math.floor(now / (windowSeconds * 1000))}`
  const count = await redis.incr(windowKey)
  if (count === 1) await redis.expire(windowKey, windowSeconds)
  return count <= limit
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: 'Trop de requêtes. Réessaie dans un moment.' },
    { status: 429, headers: { 'Retry-After': '60' } }
  )
}
