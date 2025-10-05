// Adaptive regional parsing logic for different ZIP codes
export class RegionalParser {
  constructor() {
    this.regionalConfigs = new Map()
    this.initializeRegionalConfigs()
  }

  // Initialize regional configurations based on ZIP code patterns
  initializeRegionalConfigs() {
    // West Coast (CA, OR, WA) - 9xxxx, 8xxxx
    this.regionalConfigs.set('west', {
      zipPattern: /^[89]\d{4}$/,
      priceSelectors: [
        '.price-display',
        '[data-cg="price"]',
        '.vehicle-price',
        '.listing-price'
      ],
      mileageSelectors: [
        '.mileage',
        '[data-cg="mileage"]',
        '.vehicle-mileage',
        '.odometer'
      ],
      listingSelectors: [
        '.vehicle-card',
        '.listing-item',
        '.inventory-listing'
      ],
      priceRegex: /\$[\d,]+/g,
      mileageRegex: /(\d{1,3}(?:,\d{3})*)\s*miles?/gi,
      regionMultiplier: 1.02, // Higher cost of living
      sources: ['autotrader', 'carscom', 'cargurus']
    })

    // East Coast (NY, NJ, CT, MA, etc.) - 0xxxx, 1xxxx
    this.regionalConfigs.set('east', {
      zipPattern: /^[01]\d{4}$/,
      priceSelectors: [
        '.price',
        '.vehicle-price',
        '[data-testid="price"]',
        '.listing-price'
      ],
      mileageSelectors: [
        '.mileage-display',
        '.vehicle-mileage',
        '[data-testid="mileage"]'
      ],
      listingSelectors: [
        '.vehicle-listing',
        '.car-card',
        '.inventory-item'
      ],
      priceRegex: /\$[\d,]+/g,
      mileageRegex: /(\d{1,3}(?:,\d{3})*)\s*miles?/gi,
      regionMultiplier: 1.05, // Highest cost of living
      sources: ['autotrader', 'carscom', 'cargurus', 'facebook']
    })

    // Midwest (IL, OH, MI, etc.) - 4xxxx, 5xxxx, 6xxxx
    this.regionalConfigs.set('midwest', {
      zipPattern: /^[456]\d{4}$/,
      priceSelectors: [
        '.price-value',
        '.vehicle-price',
        '.car-price',
        '.listing-price'
      ],
      mileageSelectors: [
        '.mileage-value',
        '.vehicle-mileage',
        '.car-mileage'
      ],
      listingSelectors: [
        '.vehicle-item',
        '.car-listing',
        '.inventory-card'
      ],
      priceRegex: /\$[\d,]+/g,
      mileageRegex: /(\d{1,3}(?:,\d{3})*)\s*miles?/gi,
      regionMultiplier: 0.95, // Lower cost of living
      sources: ['autotrader', 'carscom', 'cargurus']
    })

    // South (TX, FL, GA, etc.) - 3xxxx, 7xxxx
    this.regionalConfigs.set('south', {
      zipPattern: /^[37]\d{4}$/,
      priceSelectors: [
        '.price-display',
        '.vehicle-price',
        '.car-price',
        '.listing-price'
      ],
      mileageSelectors: [
        '.mileage-display',
        '.vehicle-mileage',
        '.car-mileage'
      ],
      listingSelectors: [
        '.vehicle-card',
        '.car-listing',
        '.inventory-item'
      ],
      priceRegex: /\$[\d,]+/g,
      mileageRegex: /(\d{1,3}(?:,\d{3})*)\s*miles?/gi,
      regionMultiplier: 0.98, // Slightly lower cost
      sources: ['autotrader', 'carscom', 'cargurus', 'facebook']
    })

    // Mountain West (CO, UT, AZ, etc.) - 8xxxx
    this.regionalConfigs.set('mountain', {
      zipPattern: /^8\d{4}$/,
      priceSelectors: [
        '.price',
        '.vehicle-price',
        '.listing-price'
      ],
      mileageSelectors: [
        '.mileage',
        '.vehicle-mileage'
      ],
      listingSelectors: [
        '.vehicle-listing',
        '.car-card'
      ],
      priceRegex: /\$[\d,]+/g,
      mileageRegex: /(\d{1,3}(?:,\d{3})*)\s*miles?/gi,
      regionMultiplier: 1.00, // Average cost
      sources: ['autotrader', 'carscom']
    })
  }

  // Get regional configuration for a ZIP code
  getRegionalConfig(zipCode) {
    const zip = zipCode.toString().padStart(5, '0')
    
    for (const [region, config] of this.regionalConfigs) {
      if (config.zipPattern.test(zip)) {
        return { ...config, region }
      }
    }
    
    // Default configuration for unknown regions
    return {
      zipPattern: /.*/,
      priceSelectors: ['.price', '.vehicle-price', '.listing-price'],
      mileageSelectors: ['.mileage', '.vehicle-mileage'],
      listingSelectors: ['.vehicle-listing', '.car-card'],
      priceRegex: /\$[\d,]+/g,
      mileageRegex: /(\d{1,3}(?:,\d{3})*)\s*miles?/gi,
      regionMultiplier: 1.00,
      sources: ['autotrader', 'carscom'],
      region: 'default'
    }
  }

  // Adaptive parsing based on region
  parseListings(html, vehicleData, source) {
    const config = this.getRegionalConfig(vehicleData.zipCode)
    const results = []

    // Try multiple parsing strategies based on region
    const strategies = this.getParsingStrategies(config, source)
    
    for (const strategy of strategies) {
      try {
        const parsed = strategy(html, config, vehicleData)
        if (parsed && parsed.length > 0) {
          results.push(...parsed)
        }
      } catch (error) {
        console.log(`Parsing strategy failed for ${source}:`, error.message)
        continue
      }
    }

    // Apply regional adjustments
    return this.applyRegionalAdjustments(results, config, vehicleData)
  }

  // Get parsing strategies based on region and source
  getParsingStrategies(config, source) {
    const strategies = []

    // Strategy 1: CSS selector-based parsing
    strategies.push((html, config, vehicleData) => {
      return this.parseWithSelectors(html, config, vehicleData)
    })

    // Strategy 2: Regex-based parsing
    strategies.push((html, config, vehicleData) => {
      return this.parseWithRegex(html, config, vehicleData)
    })

    // Strategy 3: JSON-LD structured data (if available)
    if (config.region === 'east' || config.region === 'west') {
      strategies.push((html, config, vehicleData) => {
        return this.parseStructuredData(html, vehicleData)
      })
    }

    // Strategy 4: Region-specific parsing
    if (config.region === 'south') {
      strategies.push((html, config, vehicleData) => {
        return this.parseSouthernListings(html, vehicleData)
      })
    }

    return strategies
  }

  // CSS selector-based parsing
  parseWithSelectors(html, config, vehicleData) {
    const listings = []
    
    // Create a simple DOM parser simulation
    const priceMatches = this.extractWithRegex(html, config.priceRegex)
    const mileageMatches = this.extractWithRegex(html, config.mileageRegex)
    
    priceMatches.forEach((priceStr, index) => {
      const price = parseInt(priceStr.replace(/[$,]/g, ''))
      const mileage = mileageMatches[index] ? 
        parseInt(mileageMatches[index].replace(/[,\s]/g, '').replace('miles', '')) : null
      
      if (this.isValidPrice(price, vehicleData)) {
        listings.push({
          price,
          mileage,
          source: 'AutoTrader', // This would be dynamic
          location: vehicleData.zipCode,
          confidence: this.calculateConfidence(price, mileage, vehicleData)
        })
      }
    })
    
    return listings
  }

  // Regex-based parsing
  parseWithRegex(html, config, vehicleData) {
    const listings = []
    
    // Look for price patterns specific to the region
    const pricePatterns = this.getRegionalPricePatterns(config.region)
    
    for (const pattern of pricePatterns) {
      const matches = html.match(pattern) || []
      matches.forEach(priceStr => {
        const price = parseInt(priceStr.replace(/[$,]/g, ''))
        if (this.isValidPrice(price, vehicleData)) {
          listings.push({
            price,
            mileage: null,
            source: 'Regex Parse',
            location: vehicleData.zipCode,
            confidence: 0.7
          })
        }
      })
    }
    
    return listings
  }

  // Structured data parsing (for sites with JSON-LD)
  parseStructuredData(html, vehicleData) {
    const listings = []
    
    try {
      // Look for JSON-LD structured data
      const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gi
      const matches = html.match(jsonLdRegex) || []
      
      matches.forEach(script => {
        try {
          const jsonStr = script.replace(/<script[^>]*>/, '').replace(/<\/script>/, '')
          const data = JSON.parse(jsonStr)
          
          if (data['@type'] === 'Car' || data['@type'] === 'Vehicle') {
            const price = data.offers?.price || data.price
            const mileage = data.mileageFromOdometer?.value || data.mileage
            
            if (price && this.isValidPrice(price, vehicleData)) {
              listings.push({
                price: parseInt(price),
                mileage: mileage ? parseInt(mileage) : null,
                source: 'Structured Data',
                location: vehicleData.zipCode,
                confidence: 0.9
              })
            }
          }
        } catch (e) {
          // Skip invalid JSON
        }
      })
    } catch (error) {
      console.log('Structured data parsing failed:', error.message)
    }
    
    return listings
  }

  // Southern region specific parsing (different patterns)
  parseSouthernListings(html, vehicleData) {
    const listings = []
    
    // Southern dealers often use different price formats
    const southernPriceRegex = /Price:\s*\$?([\d,]+)|Asking:\s*\$?([\d,]+)|Listed at:\s*\$?([\d,]+)/gi
    const matches = html.match(southernPriceRegex) || []
    
    matches.forEach(match => {
      const priceStr = match.replace(/Price:\s*|Asking:\s*|Listed at:\s*|\$/g, '')
      const price = parseInt(priceStr.replace(/,/g, ''))
      
      if (this.isValidPrice(price, vehicleData)) {
        listings.push({
          price,
          mileage: null,
          source: 'Southern Region',
          location: vehicleData.zipCode,
          confidence: 0.8
        })
      }
    })
    
    return listings
  }

  // Get region-specific price patterns
  getRegionalPricePatterns(region) {
    const patterns = {
      east: [
        /\$[\d,]+/g,
        /Price:\s*\$?([\d,]+)/gi,
        /Asking:\s*\$?([\d,]+)/gi
      ],
      west: [
        /\$[\d,]+/g,
        /Listed at:\s*\$?([\d,]+)/gi,
        /Market price:\s*\$?([\d,]+)/gi
      ],
      midwest: [
        /\$[\d,]+/g,
        /Price:\s*\$?([\d,]+)/gi
      ],
      south: [
        /\$[\d,]+/g,
        /Price:\s*\$?([\d,]+)/gi,
        /Asking:\s*\$?([\d,]+)/gi,
        /Listed at:\s*\$?([\d,]+)/gi
      ],
      mountain: [
        /\$[\d,]+/g,
        /Price:\s*\$?([\d,]+)/gi
      ],
      default: [/\$[\d,]+/g]
    }
    
    return patterns[region] || patterns.default
  }

  // Extract data using regex
  extractWithRegex(html, regex) {
    const matches = html.match(regex) || []
    return matches.filter(match => match && match.length > 0)
  }

  // Validate price based on vehicle data
  isValidPrice(price, vehicleData) {
    if (!price || price < 1000 || price > 200000) return false
    
    // Additional validation based on vehicle age and type
    const year = parseInt(vehicleData.year)
    const currentYear = new Date().getFullYear()
    const age = currentYear - year
    
    // Reasonable price ranges by age
    if (age <= 1) return price >= 15000 && price <= 100000
    if (age <= 3) return price >= 10000 && price <= 80000
    if (age <= 7) return price >= 5000 && price <= 50000
    if (age <= 15) return price >= 2000 && price <= 30000
    
    return price >= 1000 && price <= 200000
  }

  // Calculate confidence score for a listing
  calculateConfidence(price, mileage, vehicleData) {
    let confidence = 0.5
    
    // Price reasonableness
    if (this.isValidPrice(price, vehicleData)) confidence += 0.2
    
    // Mileage consistency
    if (mileage && vehicleData.mileage) {
      const mileageDiff = Math.abs(mileage - parseInt(vehicleData.mileage))
      const mileageRatio = mileageDiff / parseInt(vehicleData.mileage)
      if (mileageRatio < 0.3) confidence += 0.2
      else if (mileageRatio < 0.5) confidence += 0.1
    }
    
    return Math.min(confidence, 1.0)
  }

  // Apply regional adjustments to listings
  applyRegionalAdjustments(listings, config, vehicleData) {
    return listings.map(listing => ({
      ...listing,
      adjustedPrice: Math.round(listing.price * config.regionMultiplier),
      regionMultiplier: config.regionMultiplier,
      region: config.region
    }))
  }

  // Get recommended sources for a region
  getRecommendedSources(zipCode) {
    const config = this.getRegionalConfig(zipCode)
    return config.sources
  }

  // Get region-specific search parameters
  getSearchParameters(vehicleData) {
    const config = this.getRegionalConfig(vehicleData.zipCode)
    
    return {
      radius: this.getSearchRadius(config.region),
      sortBy: this.getSortPreference(config.region),
      maxResults: this.getMaxResults(config.region)
    }
  }

  getSearchRadius(region) {
    const radii = {
      east: 50,    // Dense population, smaller radius
      west: 75,    // Spread out, larger radius
      midwest: 100, // Rural areas, largest radius
      south: 75,   // Mixed density
      mountain: 100, // Rural areas
      default: 50
    }
    return radii[region] || 50
  }

  getSortPreference(region) {
    const sorts = {
      east: 'price_asc',     // Price-conscious
      west: 'distance',      // Location-focused
      midwest: 'price_asc',  // Value-focused
      south: 'price_asc',    // Budget-conscious
      mountain: 'distance',   // Location-focused
      default: 'price_asc'
    }
    return sorts[region] || 'price_asc'
  }

  getMaxResults(region) {
    const limits = {
      east: 20,     // More listings available
      west: 25,     // High competition
      midwest: 15,  // Fewer listings
      south: 20,    // Moderate availability
      mountain: 10, // Limited listings
      default: 15
    }
    return limits[region] || 15
  }
}

// Export singleton instance
export const regionalParser = new RegionalParser()
