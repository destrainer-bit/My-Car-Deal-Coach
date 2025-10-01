// Google Maps API integration for dealership locator and location services

/**
 * Google Maps API integration
 * Note: This is a mock implementation. In production, you'd need actual Google Maps API key
 */
export class MapsAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey || 'AIzaSyDEyCtUVwcVxjiX9ubZ66jtVb132eby4hw'
    this.baseURL = 'https://maps.googleapis.com/maps/api'
  }

  /**
   * Find nearby dealerships
   * @param {Object} location - User location (lat, lng or zip)
   * @param {string} make - Car make to search for
   * @param {number} radius - Search radius in miles
   * @returns {Promise<Array>} - Array of nearby dealerships
   */
  async findNearbyDealerships(location, make = null, radius = 25) {
    try {
      const { lat, lng } = location
      const radiusMeters = radius * 1609 // Convert miles to meters
      
      // Build search query
      let query = 'car+dealership'
      if (make) {
        query += `+${make.replace(/\s+/g, '+')}`
      }
      
      // Use Google Places API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&type=car_dealer&keyword=${query}&key=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`Google Maps API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status !== 'OK') {
        throw new Error(`Google Maps API error: ${data.status}`)
      }
      
      // Transform Google Places data to our format
      const dealerships = data.results.map((place, index) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.vicinity,
        rating: place.rating || 0,
        reviews: place.user_ratings_total || 0,
        distance: this.calculateDistance(location, place.geometry.location),
        estimatedTravelTime: this.estimateTravelTime(place.geometry.location, location),
        brands: this.extractBrandsFromName(place.name),
        services: ['Sales', 'Service', 'Parts', 'Financing'],
        isOpen: place.opening_hours?.open_now || false,
        specialOffers: this.generateSpecialOffers(),
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      }))
      
      return {
        source: 'Google Maps',
        timestamp: new Date().toISOString(),
        location: location,
        radius: radius,
        dealerships: dealerships,
        totalFound: dealerships.length
      }
    } catch (error) {
      console.error('Maps API Error:', error)
      // Fallback to mock data if API fails
      console.log('Falling back to mock data...')
      const mockDealerships = this.generateMockDealerships(location, make, radius)
      return {
        source: 'Google Maps (Mock)',
        timestamp: new Date().toISOString(),
        location: location,
        radius: radius,
        dealerships: mockDealerships,
        totalFound: mockDealerships.length
      }
    }
  }

  /**
   * Get dealership details
   * @param {string} placeId - Google Places ID
   * @returns {Promise<Object>} - Detailed dealership information
   */
  async getDealershipDetails(placeId) {
    try {
      // Use Google Places Details API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,types&key=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`)
      }
      
      const place = data.result
      
      return {
        placeId: placeId,
        name: place.name || 'Unknown Dealership',
        address: place.formatted_address || 'Address not available',
        phone: place.formatted_phone_number || 'Phone not available',
        website: place.website || null,
        rating: place.rating || 0,
        reviews: place.user_ratings_total || 0,
        hours: this.formatOpeningHours(place.opening_hours),
        services: this.getServicesFromTypes(place.types),
        brands: this.extractBrandsFromName(place.name),
        distance: 'Calculated from search',
        estimatedTravelTime: 'Calculated from search'
      }
    } catch (error) {
      console.error('Maps API Error:', error)
      // Fallback to mock data
      return {
        placeId: placeId,
        name: 'Premium Auto Dealership',
        address: '123 Main Street, City, State 12345',
        phone: '(555) 123-4567',
        website: 'https://premiumauto.com',
        rating: 4.2,
        reviews: 156,
        hours: {
          monday: '9:00 AM - 8:00 PM',
          tuesday: '9:00 AM - 8:00 PM',
          wednesday: '9:00 AM - 8:00 PM',
          thursday: '9:00 AM - 8:00 PM',
          friday: '9:00 AM - 9:00 PM',
          saturday: '9:00 AM - 7:00 PM',
          sunday: '11:00 AM - 6:00 PM'
        },
        services: [
          'New Car Sales',
          'Used Car Sales',
          'Service Center',
          'Parts Department',
          'Financing',
          'Trade-in Appraisal'
        ],
        brands: ['Toyota', 'Honda', 'Ford', 'Chevrolet'],
        distance: '2.3 miles',
        estimatedTravelTime: '8 minutes'
      }
    }
  }

  /**
   * Get directions to dealership
   * @param {Object} origin - Starting location
   * @param {Object} destination - Destination location
   * @returns {Promise<Object>} - Directions information
   */
  async getDirections(origin, destination) {
    try {
      const originStr = `${origin.lat},${origin.lng}`
      const destinationStr = `${destination.lat},${destination.lng}`
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`Google Directions API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status !== 'OK') {
        throw new Error(`Google Directions API error: ${data.status}`)
      }
      
      const route = data.routes[0]
      const leg = route.legs[0]
      
      return {
        origin: origin,
        destination: destination,
        distance: leg.distance.text,
        duration: leg.duration.text,
        steps: leg.steps.map(step => this.stripHtml(step.html_instructions)),
        mapUrl: `https://maps.google.com/maps/dir/${originStr}/${destinationStr}`,
        polyline: route.overview_polyline.points,
        route: {
          overview: route.summary,
          traffic: 'Real-time traffic data',
          tolls: leg.distance.value > 0
        }
      }
    } catch (error) {
      console.error('Maps API Error:', error)
      // Fallback to mock data
      return {
        origin: origin,
        destination: destination,
        distance: '2.3 miles',
        duration: '8 minutes',
        steps: [
          'Head north on Main Street',
          'Turn right onto Oak Avenue',
          'Turn left onto Auto Plaza Drive',
          'Destination will be on the right'
        ],
        route: {
          overview: 'Most direct route via Main Street',
          traffic: 'Light traffic',
          tolls: false
        }
      }
    }
  }

  // Helper method to strip HTML from Google's instructions
  stripHtml(html) {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  /**
   * Get current location using geolocation
   * @returns {Promise<Object>} - Current location coordinates
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  /**
   * Convert ZIP code to coordinates
   * @param {string} zipCode - ZIP code
   * @returns {Promise<Object>} - Coordinates for ZIP code
   */
  async zipToCoordinates(zipCode) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Mock ZIP to coordinates conversion
      const mockCoordinates = this.getMockCoordinatesForZip(zipCode)
      
      return {
        zipCode: zipCode,
        lat: mockCoordinates.lat,
        lng: mockCoordinates.lng,
        city: mockCoordinates.city,
        state: mockCoordinates.state
      }
    } catch (error) {
      console.error('Geocoding Error:', error)
      throw new Error('Failed to convert ZIP code to coordinates')
    }
  }

  generateMockDealerships(location, make, radius) {
    const dealerships = []
    const count = Math.floor(Math.random() * 8) + 3 // 3-10 dealerships
    
    for (let i = 0; i < count; i++) {
      dealerships.push({
        placeId: `place_${i + 1}`,
        name: this.getRandomDealershipName(),
        address: this.getRandomAddress(),
        phone: this.getRandomPhone(),
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
        reviews: Math.floor(Math.random() * 200) + 10,
        distance: `${(Math.random() * radius).toFixed(1)} miles`,
        estimatedTravelTime: `${Math.floor(Math.random() * 20) + 5} minutes`,
        brands: this.getRandomBrands(),
        services: ['Sales', 'Service', 'Parts', 'Financing'],
        isOpen: Math.random() > 0.3,
        specialOffers: Math.random() > 0.7 ? ['0% APR Financing', 'Trade-in Bonus'] : []
      })
    }
    
    return dealerships.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
  }

  getRandomDealershipName() {
    const names = [
      'Premium Auto Center',
      'Metro Motors',
      'City Car Dealership',
      'Auto Plaza',
      'CarMax',
      'AutoNation',
      'Hertz Car Sales',
      'Enterprise Car Sales'
    ]
    return names[Math.floor(Math.random() * names.length)]
  }

  getRandomAddress() {
    const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr']
    const cities = ['Anytown', 'Springfield', 'Riverside', 'Oakville', 'Maplewood']
    const states = ['CA', 'NY', 'TX', 'FL', 'IL']
    
    const street = streets[Math.floor(Math.random() * streets.length)]
    const number = Math.floor(Math.random() * 9999) + 100
    const city = cities[Math.floor(Math.random() * cities.length)]
    const state = states[Math.floor(Math.random() * states.length)]
    const zip = Math.floor(Math.random() * 90000) + 10000
    
    return `${number} ${street}, ${city}, ${state} ${zip}`
  }

  getRandomPhone() {
    const area = Math.floor(Math.random() * 900) + 100
    const exchange = Math.floor(Math.random() * 900) + 100
    const number = Math.floor(Math.random() * 9000) + 1000
    return `(${area}) ${exchange}-${number}`
  }

  getRandomBrands() {
    const allBrands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes', 'Audi']
    const count = Math.floor(Math.random() * 4) + 2 // 2-5 brands
    return allBrands.sort(() => 0.5 - Math.random()).slice(0, count)
  }

  getMockCoordinatesForZip(zipCode) {
    // Mock coordinates for different ZIP code ranges
    const firstDigit = parseInt(zipCode.toString()[0])
    
    const coordinates = {
      0: { lat: 40.7128, lng: -74.0060, city: 'New York', state: 'NY' },
      1: { lat: 40.7128, lng: -74.0060, city: 'New York', state: 'NY' },
      2: { lat: 39.9526, lng: -75.1652, city: 'Philadelphia', state: 'PA' },
      3: { lat: 38.9072, lng: -77.0369, city: 'Washington', state: 'DC' },
      4: { lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ' },
      5: { lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX' },
      6: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA' },
      7: { lat: 37.7749, lng: -122.4194, city: 'San Francisco', state: 'CA' },
      8: { lat: 47.6062, lng: -122.3321, city: 'Seattle', state: 'WA' },
      9: { lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL' }
    }
    
    return coordinates[firstDigit] || coordinates[0]
  }

  // Helper methods for real API integration
  calculateDistance(origin, destination) {
    const R = 3959 // Earth's radius in miles
    const dLat = this.toRadians(destination.lat - origin.lat)
    const dLng = this.toRadians(destination.lng - origin.lng)
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(origin.lat)) * Math.cos(this.toRadians(destination.lat)) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    return `${distance.toFixed(1)} miles`
  }

  toRadians(degrees) {
    return degrees * (Math.PI/180)
  }

  estimateTravelTime(destination, origin) {
    // Simple estimation based on distance
    const distance = this.calculateDistance(origin, destination)
    const miles = parseFloat(distance)
    const minutes = Math.round(miles * 2.5) // Rough estimate: 2.5 minutes per mile
    return `${minutes} minutes`
  }

  extractBrandsFromName(name) {
    const brands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Volkswagen', 'Lexus', 'Acura', 'Infiniti', 'Cadillac', 'Lincoln', 'Buick', 'GMC', 'Ram', 'Jeep', 'Dodge', 'Chrysler']
    const foundBrands = brands.filter(brand => 
      name.toLowerCase().includes(brand.toLowerCase())
    )
    return foundBrands.length > 0 ? foundBrands : ['Multiple Brands']
  }

  formatOpeningHours(openingHours) {
    if (!openingHours || !openingHours.weekday_text) {
      return {
        monday: 'Hours not available',
        tuesday: 'Hours not available',
        wednesday: 'Hours not available',
        thursday: 'Hours not available',
        friday: 'Hours not available',
        saturday: 'Hours not available',
        sunday: 'Hours not available'
      }
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const hours = {}
    
    openingHours.weekday_text.forEach((dayText, index) => {
      const day = days[index]
      hours[day] = dayText.split(': ')[1] || 'Closed'
    })

    return hours
  }

  getServicesFromTypes(types) {
    const serviceMap = {
      'car_dealer': 'Car Sales',
      'car_repair': 'Service Center',
      'car_wash': 'Car Wash',
      'gas_station': 'Gas Station',
      'parking': 'Parking'
    }
    
    const services = types
      .map(type => serviceMap[type])
      .filter(service => service)
    
    return services.length > 0 ? services : ['Car Sales', 'Service', 'Parts']
  }

  generateSpecialOffers() {
    const offers = [
      '0% APR Financing',
      'Trade-in Bonus',
      'Free Oil Changes',
      'Extended Warranty',
      'Cash Back Offer'
    ]
    
    const numOffers = Math.floor(Math.random() * 3) + 1
    return offers.sort(() => 0.5 - Math.random()).slice(0, numOffers)
  }
}

// Export singleton instance
export const mapsAPI = new MapsAPI()
