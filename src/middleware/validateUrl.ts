import { Request, Response, NextFunction } from "express"

export const validateUrl = (req: Request, res: Response, next: NextFunction) => {
    const { originalUrl } = req.body
  
    console.log("BODY:", req.body)
  console.log("URL:", originalUrl)
  
    try {
      new URL(originalUrl)
      next()
    } catch {
      res.status(400).json({ message: "Invalid URL" })
    }
  }