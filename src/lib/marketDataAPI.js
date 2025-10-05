// Market data API for Car Deal Coach
// Scrapes real market data from various sources
import { regionalParser } from './regionalParser.js'

export class MarketDataAPI {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 30 * 60 * 1000 // 30 minutes
  }

  // Main function to get regional pricing
  async getRegionalPricing(vehicleData) {
    const cacheKey = this.getCacheKey(vehicleData)
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    try {
      // Get regional configuration
      const regionalConfig = regionalParser.getRegionalConfig(vehicleData.zipCode)
      const recommendedSources = regionalParser.getRecommendedSources(vehicleData.zipCode)
      const searchParams = regionalParser.getSearchParameters(vehicleData)
      
      console.log(`🌍 Regional config for ${vehicleData.zipCode}:`, {
        region: regionalConfig.region,
        sources: recommendedSources,
        searchParams
      })

      // Try sources in regional order of preference
      const sources = this.getRegionalSources(recommendedSources, vehicleData, searchParams)

      for (const source of sources) {
        try {
          const data = await source()
          if (data && data.listings && data.listings.length > 0) {
            const result = this.processMarketData(data, vehicleData, regionalConfig)
            this.cache.set(cacheKey, { data: result, timestamp: Date.now() })
            return result
          }
        } catch (error) {
          console.log(`Source failed for ${regionalConfig.region}: ${error.message}`)
          continue
        }
      }

      // If all sources fail, return null to use fallback
      return null
    } catch (error) {
      console.error('Market data API error:', error)
      return null
    }
  }

  // Get regional sources based on ZIP code
  getRegionalSources(recommendedSources, vehicleData, searchParams) {
    const sources = []
    
    recommendedSources.forEach(sourceName => {
      switch (sourceName) {
        case 'autotrader':
          sources.push(() => this.scrapeAutoTrader(vehicleData, searchParams))
          break
        case 'carscom':
          sources.push(() => this.scrapeCarsCom(vehicleData, searchParams))
          break
        case 'cargurus':
          sources.push(() => this.scrapeCarGurus(vehicleData, searchParams))
          break
        case 'facebook':
          sources.push(() => this.scrapeFacebookMarketplace(vehicleData, searchParams))
          break
      }
    })
    
    return sources
  }

  // AutoTrader scraping with regional parameters
  async scrapeAutoTrader(vehicleData, searchParams = {}) {
    const { year, make, model, zipCode } = vehicleData
    const makeCode = this.getMakeCode(make)
    const modelCode = this.getModelCode(make, model)
    
    const url = `https://www.autotrader.com/cars-for-sale/all-cars/${zipCode}?makeCodeList=${makeCode}&modelCodeList=${modelCode}&startYear=${year}&endYear=${year}&sortBy=${searchParams.sortBy || 'relevance'}&numRecords=${searchParams.maxResults || 25}&radius=${searchParams.radius || 50}`
    
    const response = await this.fetchWithRetry(url)
    const html = await response.text()
    
    return this.parseAutoTraderHTML(html, vehicleData)
  }

  // Cars.com scraping
  async scrapeCarsCom(vehicleData) {
    const { year, make, model, zipCode } = vehicleData
    
    const url = `https://www.cars.com/shopping/results/?zip=${zipCode}&makes[]=${make.toLowerCase()}&models[]=${model.toLowerCase()}&year_min=${year}&year_max=${year}&sort=best_match_desc&page_size=20`
    
    const response = await this.fetchWithRetry(url)
    const html = await response.text()
    
    return this.parseCarsComHTML(html, vehicleData)
  }

  // CarGurus scraping
  async scrapeCarGurus(vehicleData) {
    const { year, make, model, zipCode } = vehicleData
    
    const url = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=${zipCode}&inventorySearchWidgetType=AUTO&makeName=${make}&modelName=${model}&year=${year}&sortDir=ASC&sortType=DEAL_SCORE&sourceContext=carGurusHomePageModel`
    
    const response = await this.fetchWithRetry(url)
    const html = await response.text()
    
    return this.parseCarGurusHTML(html, vehicleData)
  }

  // Facebook Marketplace scraping (simpler, less reliable)
  async scrapeFacebookMarketplace(vehicleData) {
    const { year, make, model, zipCode } = vehicleData
    const searchTerm = `${year} ${make} ${model}`
    
    // Note: This is a simplified approach - Facebook's actual structure is complex
    const url = `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(searchTerm)}&sortBy=creation_time_descend&daysSinceListed=7`
    
    const response = await this.fetchWithRetry(url)
    const html = await response.text()
    
    return this.parseFacebookHTML(html, vehicleData)
  }

  // Parse AutoTrader HTML with regional parsing
  parseAutoTraderHTML(html, vehicleData) {
    const listings = regionalParser.parseListings(html, vehicleData, 'AutoTrader')
    
    return { 
      listings, 
      source: 'AutoTrader',
      region: regionalParser.getRegionalConfig(vehicleData.zipCode).region
    }
  }

  // Parse Cars.com HTML with regional parsing
  parseCarsComHTML(html, vehicleData) {
    const listings = regionalParser.parseListings(html, vehicleData, 'Cars.com')
    
    return { 
      listings, 
      source: 'Cars.com',
      region: regionalParser.getRegionalConfig(vehicleData.zipCode).region
    }
  }

  // Parse CarGurus HTML with regional parsing
  parseCarGurusHTML(html, vehicleData) {
    const listings = regionalParser.parseListings(html, vehicleData, 'CarGurus')
    
    return { 
      listings, 
      source: 'CarGurus',
      region: regionalParser.getRegionalConfig(vehicleData.zipCode).region
    }
  }

  // Parse Facebook HTML with regional parsing
  parseFacebookHTML(html, vehicleData) {
    const listings = regionalParser.parseListings(html, vehicleData, 'Facebook Marketplace')
    
    return { 
      listings, 
      source: 'Facebook Marketplace',
      region: regionalParser.getRegionalConfig(vehicleData.zipCode).region
    }
  }

  // Process market data into pricing range with regional adjustments
  processMarketData(marketData, vehicleData, regionalConfig) {
    const { listings } = marketData
    
    if (!listings || listings.length === 0) {
      return null
    }

    // Filter listings by mileage if available
    const filteredListings = listings.filter(listing => {
      if (!listing.mileage) return true
      
      const userMileage = parseInt(vehicleData.mileage)
      const listingMileage = listing.mileage
      
      // Accept listings within 50% mileage range
      return Math.abs(listingMileage - userMileage) / userMileage < 0.5
    })

    if (filteredListings.length === 0) {
      return null
    }

    // Calculate statistics with regional adjustments
    const prices = filteredListings.map(l => l.adjustedPrice || l.price).sort((a, b) => a - b)
    const count = prices.length
    
    const low = Math.round(prices[Math.floor(count * 0.1)]) // 10th percentile
    const mid = Math.round(prices[Math.floor(count * 0.5)]) // 50th percentile (median)
    const high = Math.round(prices[Math.floor(count * 0.9)]) // 90th percentile

    return {
      low,
      mid,
      high,
      count,
      source: marketData.source,
      region: marketData.region || regionalConfig.region,
      explanation: `Based on ${count} listings from ${marketData.source} in your ${regionalConfig.region} region`,
      listings: filteredListings.slice(0, 5), // Keep top 5 for reference
      regionalAdjustment: regionalConfig.regionMultiplier,
      confidence: this.calculateRegionalConfidence(filteredListings, regionalConfig)
    }
  }

  // Calculate confidence based on regional data quality
  calculateRegionalConfidence(listings, regionalConfig) {
    let confidence = 0.5
    
    // More listings = higher confidence
    if (listings.length >= 10) confidence += 0.2
    else if (listings.length >= 5) confidence += 0.1
    
    // Regional multiplier indicates data quality
    if (regionalConfig.regionMultiplier >= 1.0) confidence += 0.1
    
    // High-confidence regions
    if (['east', 'west'].includes(regionalConfig.region)) confidence += 0.1
    
    return Math.min(confidence, 1.0)
  }

  // Helper methods
  getCacheKey(vehicleData) {
    return `${vehicleData.year}-${vehicleData.make}-${vehicleData.model}-${vehicleData.zipCode}`
  }

  getMakeCode(make) {
    const makeCodes = {
      'honda': 'HONDA',
      'toyota': 'TOYOTA',
      'ford': 'FORD',
      'chevrolet': 'CHEV',
      'nissan': 'NISSAN',
      'bmw': 'BMW',
      'mercedes-benz': 'MERC',
      'audi': 'AUDI',
      'volkswagen': 'VOLKS',
      'hyundai': 'HYUNDAI',
      'kia': 'KIA',
      'mazda': 'MAZDA',
      'subaru': 'SUBARU',
      'lexus': 'LEXUS',
      'acura': 'ACURA',
      'infiniti': 'INFIN',
      'cadillac': 'CADILLAC',
      'lincoln': 'LINCOLN',
      'jeep': 'JEEP',
      'ram': 'RAM',
      'gmc': 'GMC',
      'buick': 'BUICK',
      'chrysler': 'CHRYSLER',
      'dodge': 'DODGE'
    }
    return makeCodes[make.toLowerCase()] || make.toUpperCase()
  }

  getModelCode(make, model) {
    // This would need to be expanded with actual model codes
    // For now, return the model as-is
    return model.toUpperCase()
  }

  async fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          }
        })
        
        if (response.ok) {
          return response
        }
        
        if (i === maxRetries - 1) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }
}

// Export singleton instance
export const marketDataAPI = new MarketDataAPI()