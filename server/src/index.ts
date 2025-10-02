/**
 * NZ CarScope 后端服务器
 */
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { config, validateConfig } from './config/index.js'
import { logger } from './utils/logger.js'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import routes from './routes/index.js'

// 验证配置
try {
  validateConfig()
} catch (error) {
  logger.error('配置验证失败:', error)
  process.exit(1)
}

// 创建Express应用
const app = express()

// 安全中间件
app.use(helmet())

// CORS配置
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
)

// 压缩响应
app.use(compression())

// 请求体解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 请求日志
app.use(requestLogger)

// API限流
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    timestamp: new Date().toISOString(),
  },
})
app.use('/api/', limiter)

// API路由
app.use('/api', routes)

// 根路径
app.get('/', (req, res) => {
  res.json({
    name: 'NZ CarScope API',
    version: '0.1.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      market: '/api/market',
      listings: '/api/listings',
    },
  })
})

// 404处理
app.use(notFoundHandler)

// 错误处理
app.use(errorHandler)

// 启动服务器
const PORT = config.port

app.listen(PORT, () => {
  logger.info(`🚀 NZ CarScope API 服务器已启动`)
  logger.info(`📡 监听端口: ${PORT}`)
  logger.info(`🌍 环境: ${config.nodeEnv}`)
  logger.info(`✅ Trade Me API: ${config.trademe.apiBaseUrl}`)
  logger.info('')
  logger.info('可用端点:')
  logger.info(`  - http://localhost:${PORT}/`)
  logger.info(`  - http://localhost:${PORT}/api/health`)
  logger.info(`  - http://localhost:${PORT}/api/market/overview`)
  logger.info(`  - http://localhost:${PORT}/api/listings/recent`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('收到SIGTERM信号,正在关闭服务器...')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('收到SIGINT信号,正在关闭服务器...')
  process.exit(0)
})
