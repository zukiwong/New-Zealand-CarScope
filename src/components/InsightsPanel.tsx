import { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Zap, Target } from 'lucide-react'
import { getBrandStats, getMarketInsights, type BrandData } from '../services/api'

// 燃料类型颜色映射
const fuelColorMap: Record<string, string> = {
  'Petrol': '#06b6d4',
  'Diesel': '#10b981',
  'Hybrid': '#f59e0b',
  'Electric': '#8b5cf6',
  'Unknown': '#6b7280',
}

export function InsightsPanel() {
  const [topBrands, setTopBrands] = useState<BrandData[]>([])
  const [fuelTypeData, setFuelTypeData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [priceRangeData, setPriceRangeData] = useState<Array<{ range: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [insightsLoading, setInsightsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBrandStats()
        // 按增长率排序，取前4个增长最快的品牌
        const trending = [...data.brands]
          .sort((a, b) => b.change - a.change)
          .slice(0, 4)
        setTopBrands(trending)
      } catch (error) {
        console.error('获取洞察数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const data = await getMarketInsights()

        // 转换燃料类型数据
        const fuelData = data.fuelTypes.map(item => ({
          name: item.name,
          value: item.value,
          color: fuelColorMap[item.name] || '#6b7280',
        }))
        setFuelTypeData(fuelData)

        // 设置价格范围数据
        setPriceRangeData(data.priceRanges)
      } catch (error) {
        console.error('获取市场统计失败:', error)
      } finally {
        setInsightsLoading(false)
      }
    }
    fetchInsights()
  }, [])

  return (
    <div className="space-y-6">
      {/* Trending Brands */}
      <Card className="bg-slate-900/50 border-amber-500/30 backdrop-blur-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-amber-400 font-mono uppercase tracking-wider">Fastest Growing Brands</h3>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {topBrands.map((brand, index) => (
                <div key={brand.name} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-xs font-mono flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span className="text-cyan-300 font-mono">{brand.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-slate-400 font-mono text-sm">{brand.count} listings</span>
                    <Badge className={brand.change >= 0 ? "bg-green-500/20 text-green-400 border-green-500/30 font-mono" : "bg-red-500/20 text-red-400 border-red-500/30 font-mono"}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {brand.change >= 0 ? '+' : ''}{brand.change}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Fuel Type Distribution */}
      <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-purple-400 font-mono uppercase tracking-wider">Fuel Type Analysis</h3>
          </div>

          {insightsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
            </div>
          ) : fuelTypeData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 font-mono text-sm">No data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fuelTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {fuelTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {fuelTypeData.map((fuel) => (
                  <div key={fuel.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: fuel.color }}
                      />
                      <span className="text-slate-300 font-mono">{fuel.name}</span>
                    </div>
                    <span className="text-cyan-400 font-mono">{fuel.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Price Range Distribution */}
      <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-sm">
        <div className="p-6 space-y-4">
          <h3 className="text-blue-400 font-mono uppercase tracking-wider">Price Range Distribution</h3>

          {insightsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            </div>
          ) : priceRangeData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 font-mono text-sm">No data available</p>
            </div>
          ) : (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceRangeData}>
                    <XAxis
                      dataKey="range"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-slate-400 font-mono text-sm">
                <span className="text-blue-400">ANALYSIS:</span> Based on {priceRangeData.reduce((sum, item) => sum + item.count, 0)} analyzed listings
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}