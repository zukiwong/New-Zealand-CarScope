import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Clock, MapPin, Fuel, Settings } from 'lucide-react'

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

const mockListings: LiveListing[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Corolla',
    year: 2018,
    price: 15800,
    region: 'Auckland',
    odometer: 85000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    timeAdded: '2 min ago'
  },
  {
    id: '2',
    make: 'Mazda',
    model: 'CX-5',
    year: 2020,
    price: 28900,
    region: 'Canterbury',
    odometer: 45000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    timeAdded: '5 min ago'
  },
  {
    id: '3',
    make: 'Honda',
    model: 'CR-V',
    year: 2019,
    price: 26500,
    region: 'Wellington',
    odometer: 62000,
    fuelType: 'Hybrid',
    transmission: 'CVT',
    timeAdded: '8 min ago'
  },
  {
    id: '4',
    make: 'Ford',
    model: 'Ranger',
    year: 2021,
    price: 45900,
    region: 'Waikato',
    odometer: 28000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    timeAdded: '12 min ago'
  },
  {
    id: '5',
    make: 'Nissan',
    model: 'X-Trail',
    year: 2017,
    price: 19800,
    region: 'Auckland',
    odometer: 98000,
    fuelType: 'Petrol',
    transmission: 'CVT',
    timeAdded: '15 min ago'
  }
]

export function LiveFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mockListings.length)
        setIsAnimating(false)
      }, 300)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])
  
  const currentListing = mockListings[currentIndex]
  
  return (
    <Card className="bg-slate-900/50 border-green-500/30 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-green-400 font-mono uppercase tracking-wider">Live Feed Scanner</h2>
            <p className="text-slate-400 font-mono text-sm">Real-time market additions</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-mono text-sm uppercase">Active</span>
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
                {mockListings.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? 'bg-green-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-slate-400 font-mono text-xs">
                <span className="text-green-400">FEED STATUS:</span> {mockListings.length} new listings detected
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}