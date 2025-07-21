// Redis Client Utility
// Handles connection, caching, rate limiting, and health checks
import Redis from "ioredis";
import { config } from "../config";

export const redis = new Redis(config.REDIS_URL);

export async function redisHealthCheck() {
  try {
    await redis.ping();
    return true;
  } catch (err) {
    return false;
  }
}

// Example cache set/get
export async function setCache(key: string, value: any, ttlSeconds = 3600) {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function getCache(key: string) {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

// Example rate limiter
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
) {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return current > limit;
}
