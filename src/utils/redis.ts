/**
 * Redis utility module for connection, health check, and shared Redis instance.
 * Also provides helpers for user profile caching, JWT blacklist, and error log list.
 */
import Redis from "ioredis";
import { logger } from "../utils/Logger";

const redisUrl = process.env.REDIS_URL!;

/**
 * Shared Redis client instance for the app.
 * Handles connection and error events for observability.
 */
export const redis = new Redis(redisUrl);

redis.on("connect", () => {
  logger.info("🟢 Redis connected successfully.");
});

redis.on("error", (err) => {
  logger.error("🔴 Redis connection error:", err);
});

/**
 * Health check utility for Redis.
 * @returns {Promise<boolean>} True if Redis is healthy, false otherwise.
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (err) {
    logger.error("Redis health check failed:", err);
    return false;
  }
}

/**
 * User profile caching helpers
 */
export async function cacheUserProfile(
  userId: string,
  profile: any,
  ttl = 300
) {
  await redis.set(`user:profile:${userId}`, JSON.stringify(profile), "EX", ttl);
}
export async function getCachedUserProfile(userId: string) {
  const cached = await redis.get(`user:profile:${userId}`);
  return cached ? JSON.parse(cached) : null;
}

/**
 * JWT blacklist helpers (for logout/invalidation)
 */
export async function blacklistJWT(token: string, ttl: number) {
  await redis.set(`jwt:blacklist:${token}`, "1", "EX", ttl);
}
export async function isJWTBlacklisted(token: string) {
  return !!(await redis.get(`jwt:blacklist:${token}`));
}

/**
 * Error log list (for real-time monitoring)
 */
export async function pushErrorLog(error: any) {
  await redis.lpush("error:logs", JSON.stringify(error));
  await redis.ltrim("error:logs", 0, 99); // Keep only the latest 100 errors
}
