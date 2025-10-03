import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { MarketOverview } from './components/MarketOverview'
import { BrandExplorer } from './components/BrandExplorer'
import { LiveFeed } from './components/LiveFeed'
import { InsightsPanel } from './components/InsightsPanel'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Search, Activity, BarChart3, Radar, Zap } from 'lucide-react'

export default function App() {
  const [isScanning, setIsScanning] = useState(false)

  const handleScanToggle = () => {
    setIsScanning(!isScanning)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <Card className="bg-slate-900/80 border-cyan-500/50 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Radar className={`w-8 h-8 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
                  {isScanning && (
                    <div className="absolute inset-0 w-8 h-8 border-2 border-cyan-400/30 rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl text-cyan-400 font-mono uppercase tracking-wider">
                    New Zealand CarScope
                  </h1>
                  <p className="text-slate-400 font-mono text-sm">
                    NZ Used Car Data Explorer • Trade Me API Integration
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleScanToggle}
                  variant={isScanning ? "destructive" : "default"}
                  className={`font-mono uppercase tracking-wide ${
                    isScanning
                      ? 'bg-red-600/80 hover:bg-red-600 border-red-500'
                      : 'bg-cyan-600/80 hover:bg-cyan-600 border-cyan-500'
                  }`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isScanning ? 'Stop Scan' : 'Start Scan'}
                </Button>
                <div className="flex items-center space-x-2 text-slate-400 font-mono text-sm">
                  <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span className="uppercase">{isScanning ? 'Scanning' : 'Standby'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-cyan-500/30 p-1 h-auto">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/50 text-slate-400 font-mono uppercase tracking-wide border border-transparent"
            >
              <Activity className="w-4 h-4 mr-2" />
              Market Overview
            </TabsTrigger>
            <TabsTrigger 
              value="explorer" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/50 text-slate-400 font-mono uppercase tracking-wide border border-transparent"
            >
              <Search className="w-4 h-4 mr-2" />
              Brand Explorer
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/50 text-slate-400 font-mono uppercase tracking-wide border border-transparent"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <TabsContent value="overview" className="mt-0">
                <MarketOverview />
              </TabsContent>

              <TabsContent value="explorer" className="mt-0">
                <BrandExplorer />
              </TabsContent>

              <TabsContent value="insights" className="mt-0">
                <InsightsPanel />
              </TabsContent>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <LiveFeed isScanning={isScanning} />
              
              {/* System Status */}
              <Card className="bg-slate-900/50 border-slate-600/30 backdrop-blur-sm">
                <div className="p-6 space-y-4">
                  <h3 className="text-slate-400 font-mono uppercase tracking-wider">System Status</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-sm">Trade Me API</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-green-400 font-mono text-xs uppercase">Connected</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-sm">Data Sync</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 font-mono text-xs uppercase">Active</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-sm">Last Update</span>
                      <span className="text-cyan-400 font-mono text-xs">{new Date().toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-sm">Total Listings</span>
                      <span className="text-cyan-400 font-mono text-xs">47,328</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Tabs>

        {/* Footer */}
        <Card className="bg-slate-900/50 border-slate-600/30 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center justify-between text-slate-500 font-mono text-xs">
              <span>© 2025 NZ CarScope • Experimental Data Explorer</span>
              <span>Powered by Trade Me Motors API • Real-time Market Intelligence</span>
            </div>
          </div>
        </Card>
      </div>
      <Analytics />
    </div>
  )
}