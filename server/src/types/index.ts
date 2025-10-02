/**
 * 后端类型定义
 */

// Trade Me API 响应类型
export interface TradeMeListingResponse {
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

export interface TradeMeMotorListing extends TradeMeListingResponse {
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

export interface TradeMeSearchResponse {
  TotalCount: number
  Page: number
  PageSize: number
  List: TradeMeMotorListing[]
}

// 搜索参数
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

// 统计数据
export interface BrandStats {
  name: string
  count: number
  change: number
  avgPrice: number
}

export interface RegionStats {
  region: string
  brands: BrandStats[]
}

export interface MarketStats {
  totalListings: number
  regions: RegionStats[]
  topBrands: BrandStats[]
  recentListings: TradeMeMotorListing[]
}

// API 响应格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// 缓存配置
export interface CacheConfig {
  ttl: number // 秒
  checkPeriod: number
}

// 日志级别
export type LogLevel = 'error' | 'warn' | 'info' | 'debug'
