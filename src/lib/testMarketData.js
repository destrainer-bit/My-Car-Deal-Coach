// Test script for market data integration
import { marketDataAPI } from './marketDataAPI.js'
import { estimatePriceRangeWithMarketData } from './pricing.js'

// Test function
export const testMarketData = async () => {
  console.log('🧪 Testing Market Data Integration...')
  
  const testVehicle = {
    year: '2020',
    make: 'Honda',
    model: 'Civic',
    mileage: '50000',
    zipCode: '90210',
    condition: 4,
    trim: 'EX'
  }
  
  try {
    console.log('📊 Testing with vehicle:', testVehicle)
    
    // Test direct market data API
    console.log('🔍 Fetching market data...')
    const marketData = await marketDataAPI.getRegionalPricing(testVehicle)
    
    if (marketData) {
      console.log('✅ Market data received:', {
        low: marketData.low,
        mid: marketData.mid,
        high: marketData.high,
        count: marketData.count,
        source: marketData.source
      })
    } else {
      console.log('⚠️ No market data available, will use algorithm')
    }
    
    // Test enhanced pricing function
    console.log('💰 Testing enhanced pricing...')
    const pricing = await estimatePriceRangeWithMarketData(testVehicle)
    
    console.log('📈 Pricing result:', {
      low: pricing.low,
      mid: pricing.mid,
      high: pricing.high,
      isRealData: pricing.isRealData,
      explanation: pricing.explanation
    })
    
    return { success: true, pricing }
  } catch (error) {
    console.error('❌ Test failed:', error)
    return { success: false, error: error.message }
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  testMarketData().then(result => {
    console.log('🧪 Market Data Test Result:', result)
  })
}
