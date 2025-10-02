/**
 * 缓存工具
 */
import NodeCache from 'node-cache'
import { config } from '../config/index.js'
import { logger } from './logger.js'

// 创建缓存实例
export const cache = new NodeCache({
  stdTTL: config.cache.ttl,
  checkperiod: config.cache.checkPeriod,
  useClones: false,
})

// 缓存事件监听
cache.on('set', (key, value) => {
  logger.debug(`缓存设置: ${key}`)
})

cache.on('del', (key, value) => {
  logger.debug(`缓存删除: ${key}`)
})

cache.on('expired', (key, value) => {
  logger.debug(`缓存过期: ${key}`)
})

/**
 * 获取或设置缓存
 * @param key 缓存键
 * @param fetchFn 获取数据的函数
 * @param ttl 过期时间(秒),可选
 */
export async function getOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // 尝试从缓存获取
  const cached = cache.get<T>(key)
  if (cached !== undefined) {
    logger.debug(`缓存命中: ${key}`)
    return cached
  }

  // 缓存未命中,调用函数获取数据
  logger.debug(`缓存未命中: ${key}`)
  const data = await fetchFn()

  // 存入缓存
  cache.set(key, data, ttl || config.cache.ttl)

  return data
}

/**
 * 清除匹配的缓存
 * @param pattern 匹配模式
 */
export function clearPattern(pattern: string | RegExp) {
  const keys = cache.keys()
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern

  const matchedKeys = keys.filter(key => regex.test(key))
  cache.del(matchedKeys)

  logger.info(`清除缓存: ${matchedKeys.length} 个键匹配 ${pattern}`)
}
