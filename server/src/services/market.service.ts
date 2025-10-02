/**
 * 市场数据服务
 */
import { tradeMeService } from './trademe.service.js'
import { logger } from '../utils/logger.js'
import type { BrandStats, RegionStats, MarketStats } from '../types/index.js'

class MarketService {
  /**
   * 获取品牌统计数据
   */
  async getBrandStats(region?: string): Promise<BrandStats[]> {
    try {
      // 常见品牌列表
      const brands = [
        'Toyota',
        'Mazda',
        'Honda',
        'Nissan',
        'Ford',
        'Holden',
        'Mitsubishi',
        'Subaru',
        'Volkswagen',
        'BMW',
      ]

      // 并发查询各品牌数量
      const statsPromises = brands.map(async (brand) => {
        try {
          const result = await tradeMeService.searchMotors({
            make: brand,
            region,
            rows: 1,
            page: 1,
          })

          return {
            name: brand,
            count: result.TotalCount || 0,
            change: Math.floor(Math.random() * 30) - 10, // 模拟变化百分比
            avgPrice: 0, // 需要进一步计算
          }
        } catch (error) {
          logger.error(`获取品牌 ${brand} 统计失败:`, error)
          return {
            name: brand,
            count: 0,
            change: 0,
            avgPrice: 0,
          }
        }
      })

      const stats = await Promise.all(statsPromises)
      return stats.sort((a, b) => b.count - a.count)
    } catch (error) {
      logger.error('获取品牌统计失败:', error)
      throw new Error('Failed to get brand statistics')
    }
  }

  /**
   * 获取区域统计数据
   */
  async getRegionStats(regions: string[]): Promise<RegionStats[]> {
    try {
      const statsPromises = regions.map(async (region) => {
        const brands = await this.getBrandStats(region)
        return {
          region,
          brands: brands.slice(0, 6), // 只返回前6个品牌
        }
      })

      return await Promise.all(statsPromises)
    } catch (error) {
      logger.error('获取区域统计失败:', error)
      throw new Error('Failed to get region statistics')
    }
  }

  /**
   * 获取市场概览数据
   */
  async getMarketOverview(): Promise<MarketStats> {
    try {
      const regions = ['Auckland', 'Canterbury', 'Waikato', 'Wellington']

      // 并发获取数据
      const [regionStats, recentListings, topBrands] = await Promise.all([
        this.getRegionStats(regions),
        tradeMeService.getRecentListings(10),
        this.getBrandStats(),
      ])

      // 计算总数
      const totalListings = topBrands.reduce((sum, brand) => sum + brand.count, 0)

      return {
        totalListings,
        regions: regionStats,
        topBrands: topBrands.slice(0, 10),
        recentListings,
      }
    } catch (error) {
      logger.error('获取市场概览失败:', error)
      throw new Error('Failed to get market overview')
    }
  }

  /**
   * 获取车型统计
   */
  async getModelStats(make: string): Promise<any[]> {
    try {
      // 这里需要根据实际API实现
      // Trade Me API可能没有直接的车型统计接口
      // 需要通过搜索聚合实现
      const result = await tradeMeService.searchMotors({
        make,
        rows: 100,
      })

      // 按车型聚合统计
      const modelMap = new Map<string, any>()

      result.List?.forEach((listing) => {
        const model = listing.Model
        if (!modelMap.has(model)) {
          modelMap.set(model, {
            name: model,
            count: 0,
            avgPrice: 0,
            totalPrice: 0,
            trend: [],
            change: 0,
          })
        }

        const stats = modelMap.get(model)!
        stats.count++
        stats.totalPrice += listing.StartPrice || 0
      })

      // 计算平均价格
      const models = Array.from(modelMap.values()).map((stats) => ({
        ...stats,
        avgPrice: Math.round(stats.totalPrice / stats.count),
        trend: this.generateMockTrend(stats.count),
        change: Math.floor(Math.random() * 20) - 5,
      }))

      return models.sort((a, b) => b.count - a.count)
    } catch (error) {
      logger.error(`获取车型统计失败 (品牌: ${make}):`, error)
      throw new Error('Failed to get model statistics')
    }
  }

  /**
   * 生成模拟趋势数据
   * TODO: 实现真实的历史数据跟踪
   */
  private generateMockTrend(baseCount: number): number[] {
    const trend: number[] = []
    let current = baseCount * 0.8

    for (let i = 0; i < 5; i++) {
      current = current * (1 + (Math.random() * 0.2 - 0.05))
      trend.push(Math.round(current))
    }

    return trend
  }
}

export const marketService = new MarketService()
