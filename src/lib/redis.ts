import Redis from 'ioredis';
let client: Redis | null = null;
export function getRedis(): Redis {
  if (client) return client;
  client = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => Math.min(times * 1000, 10000),
  });
  client.on('ready', () => console.log('[redis] ready'));
  client.on('error', (e) => console.warn('[redis] error:', e.message));
  return client;
}
export async function ensureRedisConnection() {
  const r = getRedis();
  if ((r as any).status === 'wait') await r.connect();
}