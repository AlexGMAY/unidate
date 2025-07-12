import { NextFunction } from 'express';
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient({
  url: process.env.REDIS_URI
});

export const redisGet = promisify(client.get).bind(client);
export const redisSet = promisify(client.set).bind(client);
export const redisDel = promisify(client.del).bind(client);

export const initializeRedis = async () => {
  return new Promise((resolve, reject) => {
    client.on('connect', resolve);
    client.on('error', reject);
  });
};

// Cache middleware example
export const cacheMiddleware = (key: string, ttl = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cached = await redisGet(key);
    if (cached) return res.json(JSON.parse(cached));
    
    const originalSend = res.send;
    res.send = function (body) {
      redisSet(key, body, 'EX', ttl);
      return originalSend.call(this, body);
    };
    next();
  };
};