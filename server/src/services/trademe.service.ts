/**
 * Trade Me API 服务
 * 使用 OAuth 1.0a (Consumer Key/Secret) 进行签名认证
 */
import axios, { AxiosInstance } from 'axios'
import OAuth from 'oauth-1.0a'
import crypto from 'crypto-js'
import { config } from '../config/index.js'
import { logger } from '../utils/logger.js'
import type {
  SearchParams,
  TradeMeSearchResponse,
  TradeMeMotorListing,
} from '../types/index.js'

class TradeMeService {
  private client: AxiosInstance
  private oauth: OAuth

  constructor() {
    // 初始化 OAuth 1.0a
    this.oauth = new OAuth({
      consumer: {
        key: config.trademe.consumerKey,
        secret: config.trademe.consumerSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto.HmacSHA1(baseString, key).toString(crypto.enc.Base64)
      },
    })

    // 初始化 Axios 客户端
    this.client = axios.create({
      baseURL: config.trademe.apiBaseUrl,
      timeout: 10000,
    })

    // 请求拦截器 - 添加 OAuth 签名
    this.client.interceptors.request.use(
      (requestConfig) => {
        const requestData = {
          url: `${config.trademe.apiBaseUrl}${requestConfig.url}`,
          method: requestConfig.method?.toUpperCase() || 'GET',
        }

        // 生成 OAuth 签名头
        const authHeader = this.oauth.toHeader(
          this.oauth.authorize(requestData)
        )

        // 合并 OAuth 头部到请求配置
        requestConfig.headers = requestConfig.headers || {}
        Object.assign(requestConfig.headers, authHeader)

        logger.debug(`Trade Me API 请求: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`)
        return requestConfig
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
        if (error.response) {
          logger.error('响应数据:', error.response.data)
        }
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
        `/Search/Motors/Used.json?${queryParams}`
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

  /**
   * 获取市场洞察数据（燃料类型、价格范围等统计）
   */
  async getMarketInsights() {
    try {
      // 获取大量列表用于统计分析
      const response = await this.searchMotors({
        rows: 500, // 获取500条数据进行统计
        page: 1,
      })

      const listings = response.List || []

      // 统计燃料类型
      const fuelTypeMap = new Map<string, number>()
      // 统计价格范围
      const priceRanges = {
        '0-10k': 0,
        '10-20k': 0,
        '20-30k': 0,
        '30-40k': 0,
        '40k+': 0,
      }

      listings.forEach((listing) => {
        // 燃料类型统计
        const fuelType = listing.FuelType || 'Unknown'
        fuelTypeMap.set(fuelType, (fuelTypeMap.get(fuelType) || 0) + 1)

        // 价格范围统计
        const price = listing.StartPrice || 0
        if (price < 10000) priceRanges['0-10k']++
        else if (price < 20000) priceRanges['10-20k']++
        else if (price < 30000) priceRanges['20-30k']++
        else if (price < 40000) priceRanges['30-40k']++
        else priceRanges['40k+']++
      })

      // 转换为百分比
      const total = listings.length
      const fuelTypeData = Array.from(fuelTypeMap.entries()).map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
        count,
      }))

      const priceRangeData = Object.entries(priceRanges).map(([range, count]) => ({
        range,
        count,
        percentage: Math.round((count / total) * 100),
      }))

      return {
        fuelTypes: fuelTypeData,
        priceRanges: priceRangeData,
        totalAnalyzed: total,
      }
    } catch (error) {
      logger.error('获取市场洞察失败:', error)
      throw new Error('Failed to get market insights')
    }
  }
}

export const tradeMeService = new TradeMeService()
