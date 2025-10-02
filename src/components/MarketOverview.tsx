import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { getBrandStats, type BrandData } from '../services/api'

export function MarketOverview() {
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [currentData, setCurrentData] = useState<BrandData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getBrandStats(selectedRegion === 'all' ? undefined : selectedRegion)
        setCurrentData(data.brands || [])
      } catch (err) {
        console.error('获取市场数据失败:', err)
        setError('无法加载市场数据')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedRegion])
  
  return (
    <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-cyan-400 font-mono uppercase tracking-wider">Market Overview</h2>
            <p className="text-slate-400 font-mono text-sm">Regional Brand Distribution</p>
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48 bg-slate-800 border-cyan-500/30 text-cyan-300 font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/30">
              <SelectItem value="all" className="text-cyan-300 font-mono">All Regions</SelectItem>
              <SelectItem value="Auckland" className="text-cyan-300 font-mono">Auckland</SelectItem>
              <SelectItem value="Canterbury" className="text-cyan-300 font-mono">Canterbury</SelectItem>
              <SelectItem value="Waikato" className="text-cyan-300 font-mono">Waikato</SelectItem>
              <SelectItem value="Wellington" className="text-cyan-300 font-mono">Wellington</SelectItem>
              <SelectItem value="Bay of Plenty" className="text-cyan-300 font-mono">Bay of Plenty</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-slate-400 font-mono text-sm mt-2">加载市场数据...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 font-mono">{error}</p>
          </div>
        )}

        {!loading && !error && currentData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400 font-mono">暂无数据</p>
          </div>
        )}

        {!loading && !error && currentData.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData.map((brand) => (
            <div
              key={brand.name} 
              className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-400/50 transition-all duration-300 hover:bg-slate-800/80"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-cyan-300 font-mono uppercase tracking-wide">{brand.name}</h3>
                <Badge 
                  variant={brand.change >= 0 ? 'default' : 'destructive'}
                  className={`font-mono text-xs ${
                    brand.change >= 0 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
                >
                  {brand.change >= 0 ? '+' : ''}{brand.change}%
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-2xl text-cyan-100 font-mono">{brand.count.toLocaleString()}</div>
                <div className="text-slate-400 text-xs font-mono uppercase">Active Listings</div>
              </div>
              <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                  style={{ width: `${(brand.count / Math.max(...currentData.map(b => b.count))) * 100}%` }}
                />
              </div>
            </div>
            ))}
          </div>
        )}
        
        <div className="border-t border-cyan-500/20 pt-4">
          <div className="text-slate-400 font-mono text-sm">
            <span className="text-cyan-400">SCAN STATUS:</span> Real-time market data synchronized • Last update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </Card>
  )
}