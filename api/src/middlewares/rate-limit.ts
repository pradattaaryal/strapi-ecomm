import type { Context, Next } from 'koa';
import { redisClient } from '../util/redisClient';

type RateLimitConfig = {
  windowMs?: number; // time window in ms
  max?: number; // max requests allowed
  prefix?: string;
};

export default (config: RateLimitConfig = {}) => {
  const windowMs = config.windowMs ?? 60_000; // default: 1 minute
  const max = config.max ?? 1; // default: 1 request
  const prefix = config.prefix ?? 'rl:'; // redis key prefix

  return async (ctx: Context, next: Next) => {
    try {
      const ip =
        ctx.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        ctx.ip ||
        'unknown';
      const key = `${prefix}${ip}:${ctx.method}:${ctx.path}`;
      const ttlSec = Math.ceil(windowMs / 1000);

      // Increment request count
      const count = await redisClient.incr(key);

      // If first hit, set TTL
      if (count === 1) {
        await redisClient.expire(key, ttlSec);
      }

      // Calculate remaining time
      const ttlLeft = await redisClient.ttl(key);
      ctx.set('X-RateLimit-Limit', String(max));
      ctx.set('X-RateLimit-Remaining', String(Math.max(0, max - count)));
      ctx.set('X-RateLimit-Reset', String(ttlLeft));

      // Exceeded limit
      if (count > max) {
        ctx.status = 429;
        ctx.body = {
          error: 'Too Many Requests',
          message: `Try again in ${ttlLeft}s`,
        };
        return;
      }

      await next();
    } catch (err: any) {
      strapi.log.error('[RateLimit] Middleware error:', err.message);
      await next(); // fail-open: never block requests on redis failure
    }
  };
};
