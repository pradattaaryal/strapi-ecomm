import { redisClient } from "./redisClient";

 
const PREFIX = 'cache:';

export const CacheUtil = {
  async invalidateByPrefix(prefix: string) {
    const stream = redisClient.scanStream({
      match: `${PREFIX}${prefix}*`,
      count: 100,
    });

    stream.on('data', (keys: string[]) => {
      if (keys.length) redisClient.del(...keys);  
    });
  },

  async clearAll() {
    const keys = await redisClient.keys(`${PREFIX}*`);
    if (keys.length) await redisClient.del(...keys); 
  },
};
