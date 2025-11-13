// path: src/middlewares/redis-cache.ts
import type { Context, Next } from 'koa';
import crypto from 'crypto';
import { redisClient } from '../util/redisClient';
 
interface CacheOptions {
  ttl?: number;
  prefix?: string;
  includePaths?: string[];  
}

export default (config: CacheOptions = {}) => {
  const { ttl = 60, prefix = 'cache:', includePaths = [] } = config;

  return async (ctx: Context, next: Next) => {
    try {
     
      const isWhitelisted = includePaths.some((p) => ctx.path.startsWith(p));

      if (ctx.method !== 'GET' || !isWhitelisted) {
        return await next();
      }

      const hash = crypto.createHash('md5').update(ctx.url).digest('hex');
      const cacheKey = `${prefix}${hash}`;

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        try {
          ctx.body = JSON.parse(cached);
          ctx.set('X-Cache', 'HIT');
          return;
        } catch {
          console.warn(`[Cache] Corrupted cache entry skipped for ${cacheKey}`);
        }
      }

      await next();

      if (ctx.status === 200 && ctx.body) {
        await redisClient.setex(cacheKey, ttl, JSON.stringify(ctx.body));
        ctx.set('X-Cache', 'MISS');
      }
    } catch (err) {
      console.error('[Cache Middleware] Error:', err.message);
      ctx.set('X-Cache', 'ERROR');
    }
  };
};
