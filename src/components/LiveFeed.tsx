import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Clock, MapPin, Fuel, Settings } from 'lucide-react'
import { getRecentListings, type MotorListing } from '../services/api'

interface LiveListing {
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

interface LiveFeedProps {
  isScanning: boolean
}

export function LiveFeed({ isScanning }: LiveFeedProps) {
  const [listings, setListings] = useState<LiveListing[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchListings = async () => {
    try {
      const data = await getRecentListings(10)
      // 转换 API 数据格式
      const formattedListings: LiveListing[] = data.map((item: MotorListing) => ({
        id: item.ListingId?.toString() || '',
        make: item.Make || 'Unknown',
        model: item.Model || 'Unknown',
        year: item.Year || 0,
        price: item.PriceDisplay ? parseFloat(item.PriceDisplay.replace(/[^0-9.]/g, '')) : 0,
        region: item.Region || 'Unknown',
        odometer: item.Odometer || 0,
        fuelType: item.FuelType || 'Unknown',
        transmission: item.Transmission || 'Unknown',
        timeAdded: item.StartDate ? calculateTimeAgo(new Date(item.StartDate)) : 'Recently'
      }))
      setListings(formattedListings)
    } catch (error) {
      console.error('获取实时列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    fetchListings()
  }, [])

  // 自动刷新（只在 isScanning 为 true 时）- 优化版
  useEffect(() => {
    if (!isScanning) return

    let refreshInterval: NodeJS.Timeout | null = null
    let isRefreshing = false // 节流标志

    const refreshWithThrottle = async () => {
      // 检查页面是否可见
      if (document.hidden) return

      // 请求节流 - 如果正在刷新,跳过本次
      if (isRefreshing) return

      isRefreshing = true
      await fetchListings()
      isRefreshing = false
    }

    // 页面可见性变化监听
    const handleVisibilityChange = () => {
      if (!document.hidden && isScanning) {
        // 页面重新可见时,立即刷新一次
        refreshWithThrottle()
      }
    }

    // 60秒刷新一次
    refreshInterval = setInterval(refreshWithThrottle, 60000)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      isRefreshing = false
    }
  }, [isScanning])

  useEffect(() => {
    if (listings.length === 0) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % listings.length)
        setIsAnimating(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [listings.length])

  function calculateTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds} sec ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hr ago`
    return `${Math.floor(hours / 24)} day ago`
  }

  if (loading || listings.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-green-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <p className="text-slate-400 font-mono text-sm mt-2">Load real-time data...</p>
          </div>
        </div>
      </Card>
    )
  }

  const currentListing = listings[currentIndex]
  
  return (
    <Card className="bg-slate-900/50 border-green-500/30 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-green-400 font-mono uppercase tracking-wider">Live Feed Scanner</h2>
            <p className="text-slate-400 font-mono text-sm">Real-time market additions</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
            <span className={`font-mono text-sm uppercase ${isScanning ? 'text-green-400' : 'text-slate-500'}`}>
              {isScanning ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-green-500/20 rounded-lg p-4 min-h-[120px] flex items-center">
            <div className={`w-full transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-green-400 font-mono uppercase tracking-wide">
                    {currentListing.make} {currentListing.model}
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-cyan-300 font-mono">
                    {currentListing.year}
                  </Badge>
                </div>
                <div className="text-green-300 font-mono text-xl">
                  ${currentListing.price.toLocaleString()}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono">{currentListing.region}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono">{currentListing.odometer.toLocaleString()}km</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Fuel className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono">{currentListing.fuelType}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="font-mono text-green-400">{currentListing.timeAdded}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-green-500/20 pt-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {listings.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? 'bg-green-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-slate-400 font-mono text-xs">
                <span className="text-green-400">FEED STATUS:</span> {listings.length} new listings detected
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}