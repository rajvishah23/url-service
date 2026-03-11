import express from "express"
import morgan from "morgan"
import "dotenv/config"
import swaggerUi from "swagger-ui-express"

import urlRoutes from "./modules/url/url.routes"
import { requestLogger, errorLogger } from "./logger"
import { swaggerDocument } from "./swagger"
import { redirectUrl } from "./modules/url/url.controller"
const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(requestLogger)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("/:shortCode", redirectUrl)
app.use("/api/urls", urlRoutes)

app.get("/health", (_req, res) => {
  res.json({ status: "URL Service running" })
})

app.use(errorLogger)

export default app