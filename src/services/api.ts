/**
 * 后端API客户端
 * 用于调用自己的后端服务,而不是直接调用Trade Me
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

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

  const data = await response.json()
  return data.data // 后端返回格式: { success: true, data: {...} }
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
export async function getBrandStats(region?: string) {
  const query = region ? `?region=${region}` : ''
  return apiRequest(`/api/market/brands${query}`)
}

/**
 * 获取车型统计
 */
export async function getModelStats(make: string) {
  return apiRequest(`/api/market/brands/${make}/models`)
}

/**
 * 获取最新列表
 */
export async function getRecentListings(count: number = 10) {
  return apiRequest(`/api/listings/recent?count=${count}`)
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
