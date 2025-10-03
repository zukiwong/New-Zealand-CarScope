import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { getBrandStats, getModelStats, type BrandData } from '../services/api'

interface ModelData {
  name: string
  count: number
  avgPrice: number
  trend: number[]
  change: number
}

export function BrandExplorer() {
  const [brands, setBrands] = useState<BrandData[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [models, setModels] = useState<ModelData[]>([])
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // 加载品牌列表
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        const data = await getBrandStats()
        setBrands(data.brands)
      } catch (error) {
        console.error('获取品牌列表失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  // 加载车型数据
  useEffect(() => {
    if (!selectedBrand) {
      setModels([])
      return
    }

    const fetchModels = async () => {
      try {
        setLoadingModels(true)
        const data = await getModelStats(selectedBrand)
        setModels(data)
      } catch (error) {
        console.error('获取车型数据失败:', error)
        setModels([])
      } finally {
        setLoadingModels(false)
      }
    }
    fetchModels()
  }, [selectedBrand])

  // 计算分页数据
  const totalPages = Math.ceil(brands.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBrands = brands.slice(startIndex, endIndex)

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 5) {
        for (let i = 1; i <= 7; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 4) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 6; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-cyan-400 font-mono uppercase tracking-wider">Brand Explorer</h2>
          <p className="text-slate-400 font-mono text-sm">Deep scan vehicle model analysis</p>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-slate-400 font-mono text-sm mt-2">Load brand data...</p>
          </div>
        ) : !selectedBrand ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {paginatedBrands.map((brand) => (
              <Button
                key={brand.name}
                onClick={() => setSelectedBrand(brand.name)}
                variant="outline"
                className="h-16 bg-slate-800/50 border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800 text-cyan-300 font-mono uppercase tracking-wide"
              >
                <div className="flex items-center justify-between w-full">
                  <span>{brand.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">{brand.count}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Button>
              ))}
            </div>

            {/* 分页组件 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded font-mono text-sm ${
                    currentPage === 1
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-cyan-500/30'
                  }`}
                >
                  Prev
                </button>

                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-slate-500 font-mono">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`px-3 py-1 rounded font-mono text-sm transition-all ${
                        currentPage === page
                          ? 'bg-cyan-500 text-slate-900 font-bold'
                          : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-cyan-500/30'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded font-mono text-sm ${
                    currentPage === totalPages
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-cyan-500/30'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => { setSelectedBrand(null); setSelectedModel(null) }}
                variant="outline"
                className="bg-slate-800 border-cyan-500/30 text-cyan-400 font-mono"
              >
                ← Back to Brands
              </Button>
              <h3 className="text-cyan-300 font-mono uppercase tracking-wider text-xl">{selectedBrand} Models</h3>
            </div>

            {loadingModels ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <p className="text-slate-400 font-mono text-sm mt-2">Load vehicle model data...</p>
              </div>
            ) : models.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 font-mono">No model data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {models.map((model) => (
                <div
                  key={model.name}
                  onClick={() => setSelectedModel(selectedModel === model.name ? null : model.name)}
                  className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 cursor-pointer hover:border-cyan-400/50 transition-all duration-300 hover:bg-slate-800/80"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-cyan-300 font-mono uppercase tracking-wide">{model.name}</h4>
                    <Badge 
                      variant={model.change >= 0 ? 'default' : 'destructive'}
                      className={`font-mono text-xs ${
                        model.change >= 0 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {model.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {model.change >= 0 ? '+' : ''}{model.change}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-lg text-cyan-100 font-mono">{model.count}</div>
                      <div className="text-slate-400 text-xs font-mono uppercase">Listings</div>
                    </div>
                    <div>
                      <div className="text-lg text-green-400 font-mono">${model.avgPrice.toLocaleString()}</div>
                      <div className="text-slate-400 text-xs font-mono uppercase">Avg Price</div>
                    </div>
                  </div>
                  
                  {selectedModel === model.name && (
                    <div className="mt-4 pt-4 border-t border-cyan-500/20">
                      <div className="text-slate-400 font-mono text-xs mb-2 uppercase">7-Day Trend</div>
                      <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={model.trend.map((value, index) => ({ value, day: index + 1 }))}>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={false} />
                            <YAxis axisLine={false} tickLine={false} tick={false} />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#06b6d4" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}