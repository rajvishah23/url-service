import { createClient } from 'redis'

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redisClient.on('connect', () => console.log('✅ Redis Connected'))
redisClient.on('error', (err: any) => console.error('Redis error:', err))

export const connectRedis = async () => {
  await redisClient.connect()
}

export default redisClient
