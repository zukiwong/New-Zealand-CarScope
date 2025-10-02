/**
 * 错误处理中间件
 */
import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'
import type { ApiResponse } from '../types/index.js'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) {
  // 记录错误
  logger.error('请求错误:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  })

  // 发送错误响应
  res.status(500).json({
    success: false,
    error: error.message || '服务器内部错误',
    timestamp: new Date().toISOString(),
  })
}

/**
 * 404 处理中间件
 */
export function notFoundHandler(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) {
  res.status(404).json({
    success: false,
    error: 'API路由不存在',
    message: `Cannot ${req.method} ${req.url}`,
    timestamp: new Date().toISOString(),
  })
}
