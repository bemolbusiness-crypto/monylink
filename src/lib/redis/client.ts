import { Redis } from '@upstash/redis'

// Retourne null si Redis n'est pas configuré (env vars absentes ou placeholders).
// Le rate-limiter laisse passer quand Redis est indisponible.
export function getRedis(): Redis | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || url.startsWith('your_') || !token || token.startsWith('your_')) {
    return null
  }
  return new Redis({ url, token })
}
