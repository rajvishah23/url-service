import { createLogger, format, transports } from "winston"

const { combine, timestamp, printf, colorize, json } = format

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ""
  return `${timestamp} [${level}]: ${message}${metaString}`
})

export const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format:
    process.env.NODE_ENV === "production"
      ? combine(timestamp(), json())
      : combine(colorize(), timestamp(), logFormat),
  transports: [
    new transports.Console()
  ]
})

export const requestLogger = (req: any, _res: any, next: any) => {
  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  })
  next()
}

export const errorLogger = (err: any, _req: any, _res: any, next: any) => {
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack
  })
  next(err)
}

