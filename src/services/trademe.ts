/**
 * Trade Me API 服务层
 * 用于与Trade Me Motors API进行交互
 */

// API配置
const TRADEME_API_BASE_URL = 'https://api.trademe.co.nz/v1'
const TRADEME_OAUTH_TOKEN = import.meta.env.VITE_TRADEME_OAUTH_TOKEN || ''

// API端点
const ENDPOINTS = {
  // 搜索相关
  SEARCH_MOTORS: '/Search/Motors.json',
  SEARCH_GENERAL: '/Search/General.json',

  // 分类相关
  CATEGORIES: '/Categories.json',
  MOTOR_CATEGORIES: '/Categories/UsedMotors.json',

  // 商品详情
  LISTING_DETAILS: (listingId: number) => `/Listings/${listingId}.json`,
}

// 数据类型定义
export interface TradeMListing {
  ListingId: number
  Title: string
  StartPrice: number
  BuyNowPrice: number
  Region: string
  Suburb: string
  PictureHref: string
  CategoryPath: string
  StartDate: string
  EndDate: string
  IsBuyNowOnly: boolean
  IsClassified: boolean
}

export interface MotorListing extends TradeMListing {
  Make: string
  Model: string
  Year: number
  Odometer: number
  EngineSize: number
  FuelType: string
  Transmission: string
  BodyStyle: string
  Doors: number
  Seats: number
}

export interface SearchParams {
  make?: string
  model?: string
  yearMin?: number
  yearMax?: number
  priceMin?: number
  priceMax?: number
  odometerMin?: number
  odometerMax?: number
  region?: string
  transmission?: string
  fuelType?: string
  bodyStyle?: string
  page?: number
  rows?: number
}

/**
 * 获取Trade Me OAuth认证头
 */
function getAuthHeaders(): HeadersInit {
  return {
    'Authorization': `OAuth oauth_token="${TRADEME_OAUTH_TOKEN}"`,
    'Content-Type': 'application/json',
  }
}

/**
 * 搜索汽车列表
 * @param params 搜索参数
 * @returns 汽车列表数据
 */
export async function searchMotors(params: SearchParams = {}) {
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

  try {
    const response = await fetch(
      `${TRADEME_API_BASE_URL}${ENDPOINTS.SEARCH_MOTORS}?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('搜索汽车列表失败:', error)
    throw error
  }
}

/**
 * 获取商品详情
 * @param listingId 商品ID
 * @returns 商品详情数据
 */
export async function getListingDetails(listingId: number) {
  try {
    const response = await fetch(
      `${TRADEME_API_BASE_URL}${ENDPOINTS.LISTING_DETAILS(listingId)}`,
      {
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取商品详情失败:', error)
    throw error
  }
}

/**
 * 获取汽车分类
 * @returns 分类数据
 */
export async function getMotorCategories() {
  try {
    const response = await fetch(
      `${TRADEME_API_BASE_URL}${ENDPOINTS.MOTOR_CATEGORIES}`,
      {
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取汽车分类失败:', error)
    throw error
  }
}

/**
 * 获取品牌列表统计
 * 通过聚合搜索结果获取各品牌的数量
 */
export async function getBrandStatistics(region?: string) {
  // TODO: 实现品牌统计功能
  // 可能需要多次API调用或使用Trade Me的统计API
  console.log('getBrandStatistics - 待实现', region)
  return null
}

/**
 * 获取实时新增列表
 * 获取最近添加的汽车列表
 */
export async function getRecentListings(count: number = 10) {
  return searchMotors({
    rows: count,
    page: 1,
  })
}
