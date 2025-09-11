import { Request, Response, NextFunction } from 'express'
import { logger } from '@/lib/logger'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint()

  logger.client.info('HTTP IN', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  })

  res.on('finish', () => {
    const end = process.hrtime.bigint()
    const durationMs = Number(end - start) / 1_000_000

    logger.client.info('HTTP OUT', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(1)),
    })
  })

  next()
}
