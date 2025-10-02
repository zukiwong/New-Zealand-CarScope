/**
 * 请求日志中间件
 */
import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  // 监听响应完成
  res.on('finish', () => {
    const duration = Date.now() - start
    const { method, originalUrl, ip } = req
    const { statusCode } = res

    logger.info(`${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`)
  })

  next()
}
