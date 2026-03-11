// TODO: implement URL controller logic here
import { Request, Response } from "express"
import { prisma } from "../../prisma/client"
import { generateShortCode } from "../../utils/generateShortCode"
import redisClient from "../../redis"

const CACHE_TTL = 60 * 60 * 24  // 24 hours

export const createShortUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { originalUrl } = req.body
      const userId = (req as any).user.id
  
      const existing = await prisma.url.findFirst({
        where: {
          originalUrl,
          userId
        }
      })
    
      if (existing) {
        await redisClient.set(`url:${existing.shortCode}`, existing.originalUrl, { EX: CACHE_TTL })
        res.json({
          id: existing.id,
          originalUrl: existing.originalUrl,
          shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`
        })
        return
      }
      const shortCode = generateShortCode()
  
      const url = await prisma.url.create({
        data: {
          originalUrl,
          shortCode,
          userId
        }
      })
  
      await redisClient.set(`url:${shortCode}`, originalUrl, { EX: CACHE_TTL })

      const shortUrl = `${process.env.BASE_URL}/${shortCode}`
  
      res.json({
        id: url.id,
        originalUrl: url.originalUrl,
        shortUrl
      })
  
    } catch (error) {
      res.status(500).json({ error: "Failed to create short URL" })
    }
  }

  export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
    const shortCode = req.params.shortCode as string

    const cached = await redisClient.get(`url:${shortCode}`)

    
   const instance = process.env.INSTANCE_ID || '?'
  if (cached) {
    console.log(`✅ [Instance ${instance}] Cache HIT for ${shortCode}`)
    await prisma.url.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } }
    })
    res.redirect(cached)
    return
  }

  console.log(`❌ [Instance ${instance}] Cache MISS for ${shortCode}`)

  
    const url = await prisma.url.findUnique({
      where: { shortCode }
    })
  
    if (!url) {
      res.status(404).json({ message: "URL not found" })
      return
    }
  
    await prisma.url.update({
      where: { shortCode },
      data: {
        clicks: {
          increment: 1
        }
      }
    })
  
    res.redirect(url.originalUrl)
  }

  export const getMyUrls = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id
  
    const urls = await prisma.url.findMany({
      where: {
        userId
      }
    })
  
    res.json(urls)
  }

  export const deleteUrl = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
  
    const url = await prisma.url.findUnique({ where: { id } })
  
    if (url) {
      await redisClient.del(`url:${url.shortCode}`)  // invalidate cache
      console.log(`🗑 Cache invalidated for ${url.shortCode}`)
    }
    await prisma.url.delete({
      where: { id }
    })
  
    
    res.json({ message: "URL deleted" })
  }


  export const updateUrl = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const { originalUrl } = req.body
  
    const updated = await prisma.url.update({
      where: { id },
      data: { originalUrl }
    })

    await redisClient.set(`url:${updated.shortCode}`, originalUrl, { EX: CACHE_TTL })
   console.log(`🔄 Cache updated for ${updated.shortCode}`)
  
    res.json(updated)
  }