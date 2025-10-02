/**
 * 应用配置
 */
import dotenv from 'dotenv'

dotenv.config()

export const config = {
  // 服务器配置
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Trade Me API 配置
  trademe: {
    apiBaseUrl: process.env.TRADEME_API_BASE_URL || 'https://api.trademe.co.nz/v1',
    oauthToken: process.env.TRADEME_OAUTH_TOKEN || '',
    consumerKey: process.env.TRADEME_CONSUMER_KEY || '',
    consumerSecret: process.env.TRADEME_CONSUMER_SECRET || '',
  },

  // 缓存配置
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 默认5分钟
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '60', 10),
  },

  // API 限流配置
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10), // 1分钟
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 最多100次请求
  },

  // CORS 配置
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  // 日志配置
  log: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
} as const

// 验证必需的环境变量
export function validateConfig() {
  const required = ['TRADEME_OAUTH_TOKEN']
  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`)
  }
}
