/**
 * 市场数据控制器
 */
import { Request, Response, NextFunction } from 'express'
import { marketService } from '../services/market.service.js'
import { getOrSet } from '../utils/cache.js'
import { logger } from '../utils/logger.js'
import type { ApiResponse } from '../types/index.js'

class MarketController {
  /**
   * 获取市场概览
   */
  async getOverview(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const data = await getOrSet(
        'market:overview',
        () => marketService.getMarketOverview(),
        300 // 5分钟缓存
      )

      res.json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取品牌统计
   */
  async getBrandStats(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { region } = req.query
      const cacheKey = `brands:stats:${region || 'all'}`

      const data = await getOrSet(
        cacheKey,
        () => marketService.getBrandStats(region as string),
        300
      )

      res.json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取车型统计
   */
  async getModelStats(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { make } = req.params

      if (!make) {
        return res.status(400).json({
          success: false,
          error: '缺少品牌参数',
          timestamp: new Date().toISOString(),
        })
      }

      const cacheKey = `models:stats:${make}`
      const data = await getOrSet(
        cacheKey,
        () => marketService.getModelStats(make),
        300
      )

      res.json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取区域统计
   */
  async getRegionStats(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const regions = ['Auckland', 'Canterbury', 'Waikato', 'Wellington']
      const cacheKey = 'regions:stats'

      const data = await getOrSet(
        cacheKey,
        () => marketService.getRegionStats(regions),
        300
      )

      res.json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      next(error)
    }
  }
}

export const marketController = new MarketController()
