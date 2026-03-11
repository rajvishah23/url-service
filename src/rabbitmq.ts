import amqp from 'amqplib'
import { prisma } from './prisma/client'
import redisClient from './redis'
import { logger } from './logger'

export const connectRabbitMQ = async () => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672')
  const channel = await conn.createChannel()
  await channel.assertQueue('user.deleted', { durable: true })

  logger.info('✅ RabbitMQ Connected — listening for user.deleted')

  channel.consume('user.deleted', async (msg) => {
    if (!msg) return

    const { userId } = JSON.parse(msg.content.toString())
    logger.info(`📥 Received user.deleted for userId: ${userId}`)

    // Delete all URLs for this user
    const urls = await prisma.url.findMany({ where: { userId } })

    for (const url of urls) {
      await redisClient.del(`url:${url.shortCode}`)
    }

    await prisma.url.deleteMany({ where: { userId } })

    logger.info(`🗑 Deleted ${urls.length} URLs for userId: ${userId}`)

    channel.ack(msg)
  })
}
