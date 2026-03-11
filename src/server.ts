import "dotenv/config"
import app from "./app"
import { connectRedis } from "./redis"
import { logger } from "./logger"
import { connectRabbitMQ } from './rabbitmq'


const PORT = process.env.PORT || 4001

const startServer = async () => {
  await connectRedis()
  await connectRabbitMQ()
  app.listen(PORT, () => {
    logger.info(`URL Service running on port ${PORT}`)
  })
}

startServer()