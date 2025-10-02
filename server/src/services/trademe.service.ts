/**
 * Trade Me API 服务
 */
import axios, { AxiosInstance } from 'axios'
import { config } from '../config/index.js'
import { logger } from '../utils/logger.js'
import type {
  SearchParams,
  TradeMeSearchResponse,
  TradeMeMotorListing,
} from '../types/index.js'

class TradeMeService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: config.trademe.apiBaseUrl,
      headers: {
        Authorization: `OAuth oauth_token="${config.trademe.oauthToken}"`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Trade Me API 请求: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        logger.error('Trade Me API 请求错误:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Trade Me API 响应: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        logger.error('Trade Me API 响应错误:', error.message)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 搜索汽车列表
   */
  async searchMotors(params: SearchParams): Promise<TradeMeSearchResponse> {
    try {
      const queryParams = new URLSearchParams()

      // 构建查询参数
      if (params.make) queryParams.append('make', params.make)
      if (params.model) queryParams.append('model', params.model)
      if (params.yearMin) queryParams.append('year_min', params.yearMin.toString())
      if (params.yearMax) queryParams.append('year_max', params.yearMax.toString())
      if (params.priceMin) queryParams.append('price_min', params.priceMin.toString())
      if (params.priceMax) queryParams.append('price_max', params.priceMax.toString())
      if (params.region) queryParams.append('region', params.region)
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.rows) queryParams.append('rows', params.rows.toString())

      const response = await this.client.get<TradeMeSearchResponse>(
        `/Search/Motors.json?${queryParams}`
      )

      return response.data
    } catch (error) {
      logger.error('搜索汽车失败:', error)
      throw new Error('Failed to search motors')
    }
  }

  /**
   * 获取商品详情
   */
  async getListingDetails(listingId: number): Promise<TradeMeMotorListing> {
    try {
      const response = await this.client.get<TradeMeMotorListing>(
        `/Listings/${listingId}.json`
      )
      return response.data
    } catch (error) {
      logger.error(`获取商品详情失败 (ID: ${listingId}):`, error)
      throw new Error('Failed to get listing details')
    }
  }

  /**
   * 获取汽车分类
   */
  async getMotorCategories() {
    try {
      const response = await this.client.get('/Categories/UsedMotors.json')
      return response.data
    } catch (error) {
      logger.error('获取分类失败:', error)
      throw new Error('Failed to get categories')
    }
  }

  /**
   * 获取最新列表
   */
  async getRecentListings(count: number = 10): Promise<TradeMeMotorListing[]> {
    try {
      const response = await this.searchMotors({
        rows: count,
        page: 1,
      })
      return response.List || []
    } catch (error) {
      logger.error('获取最新列表失败:', error)
      throw new Error('Failed to get recent listings')
    }
  }
}

export const tradeMeService = new TradeMeService()
