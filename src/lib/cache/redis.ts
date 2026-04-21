import { Redis } from "@upstash/redis"

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

/**
 * Cache-aside helper. Falls back to fetcher silently if Redis is unavailable
 * (e.g. local dev without KV env vars set).
 * Read-only — never use for mutations.
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  if (redis) {
    try {
      const cached = await redis.get<T>(key)
      if (cached !== null && cached !== undefined) return cached
    } catch {
      // Redis unavailable — fall through to Supabase
    }
  }

  const fresh = await fetcher()

  if (redis) {
    try {
      await redis.set(key, fresh, { ex: ttlSeconds })
    } catch {
      // Ignore write errors — app still works without cache
    }
  }

  return fresh
}

export const CACHE_KEYS = {
  dashboardMetrics: "dashboard:metrics",
  recentAlerts:     "dashboard:alerts",
  sitesSummary:     "dashboard:sites",
  documentList:     "documents:list",
  sitesForFilter:   "documents:sites-filter",
  documentCounts:   "documents:counts",
  reports:          "reports:list",
  bottomSites:      (limit: number) => `reports:bottom-sites:${limit}`,
} as const

export const TTL = {
  alerts:    2  * 60,  //  2 min  — most time-sensitive
  dashboard: 5  * 60,  //  5 min
  sites:     10 * 60,  // 10 min
  documents: 15 * 60,  // 15 min
  reports:   30 * 60,  // 30 min
} as const
