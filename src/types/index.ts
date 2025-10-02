/**
 * 应用通用类型定义
 */

// 车辆品牌数据
export interface BrandData {
  name: string
  count: number
  change: number
}

// 区域数据
export interface RegionData {
  [key: string]: BrandData[]
}

// 车型数据
export interface ModelData {
  name: string
  count: number
  avgPrice: number
  trend: number[]
  change: number
}

// 品牌车型数据
export interface BrandModels {
  [key: string]: ModelData[]
}

// 实时列表数据
export interface LiveListing {
  id: string
  make: string
  model: string
  year: number
  price: number
  region: string
  odometer: number
  fuelType: string
  transmission: string
  timeAdded: string
}

// API响应状态
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 市场洞察数据
export interface MarketInsight {
  title: string
  description: string
  trend: 'up' | 'down' | 'stable'
  value: number | string
  change: number
}
