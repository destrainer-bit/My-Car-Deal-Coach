// Pricing estimation utilities for Car Deal Coach

export const calculateBasePrice = (year, mileage) => {
  const currentYear = new Date().getFullYear()
  const age = currentYear - parseInt(year)
  const base = 28000 - (age * 1200) - (mileage / 120)
  return Math.max(2000, Math.min(70000, base))
}

export const getZipMultiplier = (zipCode) => {
  const firstDigit = parseInt(zipCode.toString().charAt(0))
  if (firstDigit >= 0 && firstDigit <= 3) return 0.98
  if (firstDigit >= 4 && firstDigit <= 6) return 1.00
  return 1.02
}

export const getConditionMultiplier = (condition) => {
  return 1 + ((condition - 3) * 0.05)
}

export const getTrimMultiplier = (trim) => {
  const baseTrims = ['base', 'standard', 'se', 'le']
  const trimLower = trim.toLowerCase()
  return baseTrims.some(base => trimLower.includes(base)) ? 1.0 : 1.015
}

export const roundToFifty = (value) => {
  return Math.round(value / 50) * 50
}

export const generateExplanation = (base, condition, trim, zip) => {
  const factors = []
  if (condition !== 3) factors.push(`condition (${condition}/5)`)
  if (trim !== 'base') factors.push('trim level')
  if (zip !== 1.0) factors.push('location')
  
  return factors.length > 0 
    ? `Based on ${factors.join(', ')} and market data`
    : 'Based on standard market pricing'
}

export const estimatePriceRange = (vehicleData) => {
  const { year, mileage, condition = 3, trim = 'base', zipCode } = vehicleData
  
  let base = calculateBasePrice(year, mileage)
  base *= getConditionMultiplier(condition)
  base *= getTrimMultiplier(trim)
  base *= getZipMultiplier(zipCode)
  
  const low = roundToFifty(base * 0.93)
  const mid = roundToFifty(base)
  const high = roundToFifty(base * 1.07)
  
  return {
    low,
    mid,
    high,
    explanation: generateExplanation(base, condition, trim, getZipMultiplier(zipCode))
  }
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}