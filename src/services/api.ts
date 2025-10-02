/**
 * 后端API客户端
 * 用于调用自己的后端服务,而不是直接调用Trade Me
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// 响应类型定义
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// 品牌数据类型
export interface BrandData {
  name: string
  count: number
  change: number
}

export interface BrandStatsResponse {
  brands: BrandData[]
  totalListings: number
  region?: string
}

// 车辆列表类型
export interface MotorListing {
  ListingId: number
  Title: string
  Make: string
  Model: string
  Year: number
  PriceDisplay: string
  Region: string
  Odometer: number
  FuelType: string
  Transmission: string
  StartDate: string
  PictureHref?: string
}

/**
 * 通用API请求函数
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`)
  }

  const result = (await response.json()) as ApiResponse<T>
  return result.data
}

/**
 * 获取市场概览
 */
export async function getMarketOverview() {
  return apiRequest('/api/market/overview')
}

/**
 * 获取品牌统计
 */
export async function getBrandStats(region?: string): Promise<BrandStatsResponse> {
  const query = region ? `?region=${region}` : ''
  return apiRequest<BrandStatsResponse>(`/api/market/brands${query}`)
}

/**
 * 获取车型统计
 */
export async function getModelStats(make: string): Promise<any> {
  return apiRequest<any>(`/api/market/brands/${make}/models`)
}

/**
 * 获取最新列表
 */
export async function getRecentListings(count: number = 10): Promise<MotorListing[]> {
  return apiRequest<MotorListing[]>(`/api/listings/recent?count=${count}`)
}

/**
 * 搜索汽车
 */
export async function searchMotors(params: Record<string, any>) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/api/listings/search?${query}`)
}

/**
 * 获取商品详情
 */
export async function getListingDetails(id: number) {
  return apiRequest(`/api/listings/${id}`)
}

/**
 * 获取市场洞察数据（燃料类型、价格范围统计）
 */
export interface MarketInsightsResponse {
  fuelTypes: Array<{ name: string; value: number; count: number }>
  priceRanges: Array<{ range: string; count: number; percentage: number }>
  totalAnalyzed: number
}

export async function getMarketInsights(): Promise<MarketInsightsResponse> {
  return apiRequest<MarketInsightsResponse>('/api/market/insights')
}
