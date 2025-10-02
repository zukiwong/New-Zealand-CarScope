/**
 * 列表控制器
 */
import { Request, Response, NextFunction } from 'express'
import { tradeMeService } from '../services/trademe.service.js'
import { getOrSet } from '../utils/cache.js'
import type { ApiResponse, SearchParams } from '../types/index.js'

class ListingsController {
  /**
   * 搜索汽车
   */
  async search(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const params: SearchParams = {
        make: req.query.make as string,
        model: req.query.model as string,
        yearMin: req.query.yearMin ? parseInt(req.query.yearMin as string) : undefined,
        yearMax: req.query.yearMax ? parseInt(req.query.yearMax as string) : undefined,
        priceMin: req.query.priceMin ? parseInt(req.query.priceMin as string) : undefined,
        priceMax: req.query.priceMax ? parseInt(req.query.priceMax as string) : undefined,
        region: req.query.region as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        rows: req.query.rows ? parseInt(req.query.rows as string) : 20,
      }

      // 构建缓存键
      const cacheKey = `search:${JSON.stringify(params)}`

      const data = await getOrSet(
        cacheKey,
        () => tradeMeService.searchMotors(params),
        180 // 3分钟缓存
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
   * 获取商品详情
   */
  async getDetails(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { id } = req.params
      const listingId = parseInt(id)

      if (isNaN(listingId)) {
        return res.status(400).json({
          success: false,
          error: '无效的商品ID',
          timestamp: new Date().toISOString(),
        })
      }

      const cacheKey = `listing:${listingId}`
      const data = await getOrSet(
        cacheKey,
        () => tradeMeService.getListingDetails(listingId),
        600 // 10分钟缓存
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
   * 获取最新列表
   */
  async getRecent(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const count = req.query.count ? parseInt(req.query.count as string) : 10
      const cacheKey = `recent:${count}`

      const data = await getOrSet(
        cacheKey,
        () => tradeMeService.getRecentListings(count),
        60 // 1分钟缓存(实时性要求高)
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
   * 获取分类
   */
  async getCategories(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const cacheKey = 'categories'
      const data = await getOrSet(
        cacheKey,
        () => tradeMeService.getMotorCategories(),
        3600 // 1小时缓存(分类很少变化)
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

export const listingsController = new ListingsController()
