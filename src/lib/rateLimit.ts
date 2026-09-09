import { LRUCache } from "lru-cache";

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique tokens (IPs)
  maxRequests: number; // Max requests per interval
}

export class RateLimiter {
  private cache: LRUCache<string, number[]>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cache = new LRUCache<string, number[]>({
      max: config.uniqueTokenPerInterval,
      ttl: config.interval,
    });
  }

  check(identifier: string): {
    success: boolean;
    remaining: number;
    reset: number;
  } {
    const now = Date.now();
    const timestamps = this.cache.get(identifier) || [];

    // Filter out timestamps outside the current window
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.config.interval,
    );

    if (validTimestamps.length >= this.config.maxRequests) {
      const oldestTimestamp = validTimestamps[0];
      const resetTime = oldestTimestamp + this.config.interval;

      return {
        success: false,
        remaining: 0,
        reset: resetTime,
      };
    }

    // Add current timestamp
    validTimestamps.push(now);
    this.cache.set(identifier, validTimestamps);

    return {
      success: true,
      remaining: this.config.maxRequests - validTimestamps.length,
      reset: now + this.config.interval,
    };
  }
}

// Pre-configured rate limiters
export const loginRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
  maxRequests: 5, // 5 login attempts per 15 minutes
});

export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
  maxRequests: 60, // 60 requests per minute
});

// Helper to get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "127.0.0.1";
}
