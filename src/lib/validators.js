// Validation utilities for Car Deal Coach

export const validateYear = (year) => {
  const currentYear = new Date().getFullYear()
  const yearNum = parseInt(year)
  return yearNum >= 1990 && yearNum <= currentYear + 1
}

export const validateMileage = (mileage) => {
  const mileageNum = parseInt(mileage)
  return mileageNum >= 0 && mileageNum <= 500000
}

export const validateZipCode = (zip) => {
  const zipStr = zip.toString()
  return /^\d{5}(-\d{4})?$/.test(zipStr)
}

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

export const validateDealData = (dealData) => {
  const errors = []
  
  if (!validateRequired(dealData.make)) {
    errors.push('Make is required')
  }
  
  if (!validateRequired(dealData.model)) {
    errors.push('Model is required')
  }
  
  if (!validateYear(dealData.year)) {
    errors.push('Year must be between 1990 and current year')
  }
  
  if (!validateMileage(dealData.mileage)) {
    errors.push('Mileage must be between 0 and 500,000')
  }
  
  if (!validateZipCode(dealData.zipCode)) {
    errors.push('Valid ZIP code is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}