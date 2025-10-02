import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Zap, Target } from 'lucide-react'

const trendingModels = [
  { name: 'Mazda CX-5', growth: 24, listings: 876 },
  { name: 'Ford Ranger', growth: 19, listings: 654 },
  { name: 'Toyota RAV4', growth: 15, listings: 987 },
  { name: 'Honda CR-V', growth: 12, listings: 743 },
]

const fuelTypeData = [
  { name: 'Petrol', value: 65, color: '#06b6d4' },
  { name: 'Diesel', value: 20, color: '#10b981' },
  { name: 'Hybrid', value: 12, color: '#f59e0b' },
  { name: 'Electric', value: 3, color: '#8b5cf6' },
]

const priceRangeData = [
  { range: '0-10k', count: 1234 },
  { range: '10-20k', count: 2876 },
  { range: '20-30k', count: 3421 },
  { range: '30-40k', count: 1987 },
  { range: '40k+', count: 1654 },
]

export function InsightsPanel() {
  return (
    <div className="space-y-6">
      {/* Trending Models */}
      <Card className="bg-slate-900/50 border-amber-500/30 backdrop-blur-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-amber-400 font-mono uppercase tracking-wider">Fastest Growing Models</h3>
          </div>
          
          <div className="space-y-3">
            {trendingModels.map((model, index) => (
              <div key={model.name} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-xs font-mono flex items-center justify-center">
                    {index + 1}
                  </div>
                  <span className="text-cyan-300 font-mono">{model.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-slate-400 font-mono text-sm">{model.listings} listings</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{model.growth}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Fuel Type Distribution */}
      <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-purple-400 font-mono uppercase tracking-wider">Fuel Type Analysis</h3>
          </div>
          
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
        </div>
      </Card>

      {/* Price Range Distribution */}
      <Card className="bg-slate-900/50 border-blue-500/30 backdrop-blur-sm">
        <div className="p-6 space-y-4">
          <h3 className="text-blue-400 font-mono uppercase tracking-wider">Price Range Distribution</h3>
          
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
            <span className="text-blue-400">ANALYSIS:</span> Sweet spot at $20-30k range with highest inventory
          </div>
        </div>
      </Card>
    </div>
  )
}