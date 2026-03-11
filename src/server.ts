import "dotenv/config"
import app from "./app"
import { connectRedis } from "./redis"
import { logger } from "./logger"

const PORT = process.env.PORT || 4001

const startServer = async () => {
  await connectRedis()
  app.listen(PORT, () => {
    logger.info(`URL Service instance ${process.env.INSTANCE_ID} running on port ${PORT}`)
  })
}

startServer()