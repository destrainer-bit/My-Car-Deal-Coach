// Market data API integration for KBB, Edmunds, and other sources

/**
 * KBB (Kelley Blue Book) API integration
 * Note: This is a mock implementation. In production, you'd need actual API keys
 */
export class KBBAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey
    this.baseURL = 'https://api.kbb.com/v1'
  }

  /**
   * Get vehicle valuation from KBB
   * @param {Object} vehicleData - Vehicle information
   * @returns {Promise<Object>} - KBB valuation data
   */
  async getVehicleValuation(vehicleData) {
    // Mock implementation - replace with actual KBB API calls
    const { year, make, model, trim, mileage, zip } = vehicleData
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock KBB response
      const basePrice = this.calculateKBBBasePrice(year, mileage)
      const regionalAdjustment = this.getRegionalAdjustment(zip)
      
      return {
        source: 'KBB',
        timestamp: new Date().toISOString(),
        valuations: {
          tradeIn: {
            excellent: Math.round(basePrice * 0.85 * regionalAdjustment),
            good: Math.round(basePrice * 0.80 * regionalAdjustment),
            fair: Math.round(basePrice * 0.75 * regionalAdjustment)
          },
          privateParty: {
            excellent: Math.round(basePrice * 0.95 * regionalAdjustment),
            good: Math.round(basePrice * 0.90 * regionalAdjustment),
            fair: Math.round(basePrice * 0.85 * regionalAdjustment)
          },
          dealerRetail: {
            excellent: Math.round(basePrice * 1.10 * regionalAdjustment),
            good: Math.round(basePrice * 1.05 * regionalAdjustment),
            fair: Math.round(basePrice * 1.00 * regionalAdjustment)
          }
        },
        marketInsights: {
          demand: this.getMarketDemand(make, model),
          supply: this.getMarketSupply(make, model),
          trend: this.getMarketTrend(make, model)
        }
      }
    } catch (error) {
      console.error('KBB API Error:', error)
      throw new Error('Failed to fetch KBB data')
    }
  }

  calculateKBBBasePrice(year, mileage) {
    const currentYear = new Date().getFullYear()
    const age = currentYear - year
    const basePrice = 25000 - (age * 1000) - (mileage / 100)
    return Math.max(basePrice, 2000)
  }

  getRegionalAdjustment(zip) {
    const firstDigit = parseInt(zip.toString()[0])
    if (firstDigit <= 3) return 0.95 // Rural areas
    if (firstDigit <= 6) return 1.00 // Suburban areas
    return 1.05 // Urban areas
  }

  getMarketDemand(make, model) {
    const popularCars = ['toyota', 'honda', 'ford', 'chevrolet']
    return popularCars.includes(make.toLowerCase()) ? 'high' : 'medium'
  }

  getMarketSupply(make, model) {
    return Math.random() > 0.5 ? 'high' : 'medium'
  }

  getMarketTrend(make, model) {
    const trends = ['rising', 'stable', 'declining']
    return trends[Math.floor(Math.random() * trends.length)]
  }
}

/**
 * Edmunds API integration
 */
export class EdmundsAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey || 'your_edmunds_api_key_here'
    this.baseURL = 'https://api.edmunds.com/api'
  }

  /**
   * Get vehicle information and pricing from Edmunds
   * @param {Object} vehicleData - Vehicle information
   * @returns {Promise<Object>} - Edmunds data
   */
  async getVehicleData(vehicleData) {
    const { year, make, model, trim } = vehicleData
    
    try {
      // Use real Edmunds API
      const response = await fetch(
        `${this.baseURL}/v1/api/vehicle/v2/${make}/${model}/${year}?fmt=json&api_key=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`Edmunds API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      return {
        source: 'Edmunds',
        timestamp: new Date().toISOString(),
        vehicle: {
          year,
          make,
          model,
          trim,
          msrp: data.msrp || this.calculateMSRP(year, make, model),
          invoice: data.invoice || this.calculateInvoice(year, make, model),
          trueMarketValue: data.tmv || this.calculateTMV(year, make, model)
        },
        reviews: {
          overallRating: data.reviews?.overall || this.getOverallRating(make, model),
          reliability: data.reviews?.reliability || this.getReliabilityRating(make, model),
          value: data.reviews?.value || this.getValueRating(make, model)
        },
        features: data.features || this.getVehicleFeatures(make, model),
        recalls: data.recalls || this.getRecalls(make, model, year)
      }
    } catch (error) {
      console.error('Edmunds API Error:', error)
      // Fallback to mock data
      return {
        source: 'Edmunds (Mock)',
        timestamp: new Date().toISOString(),
        vehicle: {
          year,
          make,
          model,
          trim,
          msrp: this.calculateMSRP(year, make, model),
          invoice: this.calculateInvoice(year, make, model),
          trueMarketValue: this.calculateTMV(year, make, model)
        },
        reviews: {
          overallRating: this.getOverallRating(make, model),
          reliability: this.getReliabilityRating(make, model),
          value: this.getValueRating(make, model)
        },
        features: this.getVehicleFeatures(make, model),
        recalls: this.getRecalls(make, model, year)
      }
    }
  }

  calculateMSRP(year, make, model) {
    const basePrice = 28000 - ((new Date().getFullYear() - year) * 1200)
    return Math.max(basePrice, 15000)
  }

  calculateInvoice(year, make, model) {
    const msrp = this.calculateMSRP(year, make, model)
    return Math.round(msrp * 0.92)
  }

  calculateTMV(year, make, model) {
    const msrp = this.calculateMSRP(year, make, model)
    return Math.round(msrp * 0.88)
  }

  getOverallRating(make, model) {
    return (Math.random() * 2 + 3).toFixed(1) // 3.0 to 5.0
  }

  getReliabilityRating(make, model) {
    const reliableBrands = ['toyota', 'honda', 'lexus', 'mazda']
    return reliableBrands.includes(make.toLowerCase()) ? 'excellent' : 'good'
  }

  getValueRating(make, model) {
    return Math.random() > 0.5 ? 'excellent' : 'good'
  }

  getVehicleFeatures(make, model) {
    return [
      'Bluetooth Connectivity',
      'Backup Camera',
      'Automatic Transmission',
      'Air Conditioning',
      'Power Windows',
      'Cruise Control'
    ]
  }

  getRecalls(make, model, year) {
    return Math.random() > 0.7 ? [
      {
        id: 'R2024001',
        description: 'Airbag sensor recall',
        date: '2024-01-15',
        severity: 'medium'
      }
    ] : []
  }
}

/**
 * Market data aggregator that combines multiple sources
 */
export class MarketDataAggregator {
  constructor() {
    this.kbb = new KBBAPI()
    this.edmunds = new EdmundsAPI()
  }

  /**
   * Get comprehensive market data from multiple sources
   * @param {Object} vehicleData - Vehicle information
   * @returns {Promise<Object>} - Aggregated market data
   */
  async getComprehensiveMarketData(vehicleData) {
    try {
      const [kbbData, edmundsData] = await Promise.all([
        this.kbb.getVehicleValuation(vehicleData),
        this.edmunds.getVehicleData(vehicleData)
      ])

      return {
        timestamp: new Date().toISOString(),
        vehicle: vehicleData,
        sources: {
          kbb: kbbData,
          edmunds: edmundsData
        },
        recommendations: this.generateRecommendations(kbbData, edmundsData),
        marketSummary: this.generateMarketSummary(kbbData, edmundsData)
      }
    } catch (error) {
      console.error('Market data aggregation error:', error)
      throw new Error('Failed to fetch comprehensive market data')
    }
  }

  generateRecommendations(kbbData, edmundsData) {
    const kbbTradeIn = kbbData.valuations.tradeIn.good
    const edmundsTMV = edmundsData.vehicle.trueMarketValue
    const average = (kbbTradeIn + edmundsTMV) / 2

    return {
      fairPrice: Math.round(average),
      negotiationRange: {
        low: Math.round(average * 0.90),
        high: Math.round(average * 1.10)
      },
      advice: this.getNegotiationAdvice(kbbData, edmundsData)
    }
  }

  generateMarketSummary(kbbData, edmundsData) {
    return {
      marketCondition: kbbData.marketInsights.demand === 'high' ? 'seller' : 'buyer',
      priceTrend: kbbData.marketInsights.trend,
      reliability: edmundsData.reviews.reliability,
      valueRating: edmundsData.reviews.value
    }
  }

  getNegotiationAdvice(kbbData, edmundsData) {
    const advice = []
    
    if (kbbData.marketInsights.demand === 'high') {
      advice.push('High demand market - negotiate quickly')
    } else {
      advice.push('Buyer-friendly market - take your time')
    }

    if (edmundsData.reviews.reliability === 'excellent') {
      advice.push('Excellent reliability - good long-term value')
    }

    if (kbbData.marketInsights.trend === 'declining') {
      advice.push('Prices declining - consider waiting')
    }

    return advice
  }
}

// Export singleton instance
export const marketDataAPI = new MarketDataAggregator()
