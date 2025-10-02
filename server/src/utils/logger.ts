/**
 * 日志工具
 */
import winston from 'winston'
import { config } from '../config/index.js'

const { combine, timestamp, printf, colorize, errors } = winston.format

// 自定义日志格式
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`
})

// 创建 logger 实例
export const logger = winston.createLogger({
  level: config.log.level,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    // 文件输出
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
})

// 开发环境下增加详细日志
if (config.nodeEnv === 'development') {
  logger.level = 'debug'
}
