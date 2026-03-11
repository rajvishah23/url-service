 
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface AuthRequest extends Request {
  user?: any
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      res.status(401).json({ message: "No token provided" })
      return
    }

    const token = authHeader.split(" ")[1]
    const secret = process.env.JWT_SECRET as string

    const decoded = jwt.verify(token, secret)

    ;(req as AuthRequest).user = decoded

    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
}