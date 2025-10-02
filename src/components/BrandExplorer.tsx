import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'

interface ModelData {
  name: string
  count: number
  avgPrice: number
  trend: number[]
  change: number
}

interface BrandModels {
  [key: string]: ModelData[]
}

const mockBrandData: BrandModels = {
  'Toyota': [
    { name: 'Corolla', count: 1245, avgPrice: 18500, trend: [890, 920, 1050, 1180, 1245], change: 8 },
    { name: 'RAV4', count: 987, avgPrice: 28900, trend: [750, 820, 890, 950, 987], change: 12 },
    { name: 'Camry', count: 654, avgPrice: 22300, trend: [680, 665, 620, 640, 654], change: -4 },
    { name: 'Highlander', count: 432, avgPrice: 35600, trend: [380, 395, 410, 425, 432], change: 6 },
    { name: 'Yaris', count: 398, avgPrice: 15200, trend: [420, 410, 405, 400, 398], change: -2 },
  ],
  'Mazda': [
    { name: 'CX-5', count: 876, avgPrice: 26400, trend: [720, 780, 820, 850, 876], change: 15 },
    { name: 'Mazda3', count: 654, avgPrice: 19800, trend: [600, 620, 640, 650, 654], change: 3 },
    { name: 'CX-3', count: 432, avgPrice: 18900, trend: [380, 390, 410, 420, 432], change: 7 },
    { name: 'Mazda6', count: 298, avgPrice: 24500, trend: [320, 315, 310, 305, 298], change: -8 },
  ],
  'Honda': [
    { name: 'CR-V', count: 743, avgPrice: 27200, trend: [680, 700, 720, 735, 743], change: 4 },
    { name: 'Civic', count: 567, avgPrice: 20400, trend: [590, 580, 575, 570, 567], change: -2 },
    { name: 'Jazz', count: 345, avgPrice: 16800, trend: [360, 355, 350, 348, 345], change: -1 },
    { name: 'Accord', count: 234, avgPrice: 28900, trend: [250, 245, 240, 237, 234], change: -5 },
  ]
}

export function BrandExplorer() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  
  const brands = Object.keys(mockBrandData)
  const models = selectedBrand ? mockBrandData[selectedBrand] : []
  
  return (
    <Card className="bg-slate-900/50 border-cyan-500/30 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-cyan-400 font-mono uppercase tracking-wider">Brand Explorer</h2>
          <p className="text-slate-400 font-mono text-sm">Deep scan vehicle model analysis</p>
        </div>
        
        {!selectedBrand ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {brands.map((brand) => (
              <Button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                variant="outline"
                className="h-16 bg-slate-800/50 border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800 text-cyan-300 font-mono uppercase tracking-wide"
              >
                <div className="flex items-center space-x-2">
                  <span>{brand}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Button>
            ))}
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
          </div>
        )}
      </div>
    </Card>
  )
}