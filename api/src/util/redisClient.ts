import Redis, { RedisOptions } from 'ioredis';

export class RedisClient {
  private static instance: Redis | null = null;

  private constructor() {} // prevent direct instantiation

  static getInstance(): Redis {
    if (!this.instance) {
      const config: RedisOptions = {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        enableAutoPipelining: true,
        retryStrategy: (times) => Math.min(times * 100, 2000),
        reconnectOnError: (err) => err.message.includes('READONLY'),
      };

      const client = new Redis(config);

      // Lifecycle logging
      client.on('connect', () => strapi.log.info('[Redis] ✅ Connected'));
      client.on('ready', () => strapi.log.info('[Redis] 🔄 Ready'));
      client.on('error', (err) => strapi.log.error('[Redis] ❌', err.message));
      client.on('close', () => strapi.log.warn('[Redis] ⚠️ Closed'));
      client.on('reconnecting', () => strapi.log.debug('[Redis] ♻️ Reconnecting...'));

      this.instance = client;
    }

    return this.instance;
  }
}

export const redisClient = RedisClient.getInstance();
