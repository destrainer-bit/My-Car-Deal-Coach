// Data export and import utilities

/**
 * Export deals to JSON format
 * @param {Array} deals - Array of deals to export
 * @param {string} filename - Name of the file to download
 */
export const exportDealsToJSON = (deals, filename = 'car-coach-deals.json') => {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    deals: deals,
    metadata: {
      totalDeals: deals.length,
      appVersion: '1.0.0'
    }
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export deals to CSV format
 * @param {Array} deals - Array of deals to export
 * @param {string} filename - Name of the file to download
 */
export const exportDealsToCSV = (deals, filename = 'car-coach-deals.csv') => {
  const headers = [
    'ID', 'Created Date', 'Updated Date', 'Year', 'Make', 'Model', 'Trim',
    'Mileage', 'ZIP Code', 'Condition Rating', 'Condition Flags',
    'Price Low', 'Price Mid', 'Price High', 'Status', 'Notes'
  ]
  
  const csvRows = [headers.join(',')]
  
  deals.forEach(deal => {
    const row = [
      deal.id,
      deal.createdAt,
      deal.updatedAt,
      deal.vehicle.year,
      deal.vehicle.make,
      deal.vehicle.model,
      deal.vehicle.trim,
      deal.vehicle.mileage,
      deal.vehicle.zip,
      deal.condition?.rating || 'N/A',
      `"${(deal.condition?.flags || []).join('; ')}"`,
      deal.price.low,
      deal.price.mid,
      deal.price.high,
      deal.status,
      `"${deal.notes.replace(/"/g, '""')}"`
    ]
    csvRows.push(row.join(','))
  })
  
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Import deals from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<Object>} - Imported data with validation
 */
export const importDealsFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // Validate data structure
        if (!data.deals || !Array.isArray(data.deals)) {
          throw new Error('Invalid file format: missing deals array')
        }
        
        // Validate each deal
        const validatedDeals = data.deals.filter(deal => {
          return deal.id && 
                 deal.vehicle && 
                 deal.vehicle.year && 
                 deal.vehicle.make && 
                 deal.vehicle.model
        })
        
        resolve({
          success: true,
          deals: validatedDeals,
          metadata: data.metadata || {},
          warnings: data.deals.length - validatedDeals.length > 0 ? 
            `${data.deals.length - validatedDeals.length} deals were skipped due to invalid data` : null
        })
      } catch (error) {
        reject({
          success: false,
          error: error.message
        })
      }
    }
    
    reader.onerror = () => {
      reject({
        success: false,
        error: 'Failed to read file'
      })
    }
    
    reader.readAsText(file)
  })
}

/**
 * Generate backup data with all app data
 * @param {Array} deals - Array of deals
 * @param {string} notes - Notes content
 * @param {Array} photos - Array of photos
 * @returns {Object} - Complete backup data
 */
export const generateBackup = (deals, notes, photos) => {
  return {
    version: '1.0',
    backupDate: new Date().toISOString(),
    data: {
      deals: deals,
      notes: notes,
      photos: photos
    },
    metadata: {
      totalDeals: deals.length,
      totalPhotos: photos.length,
      appVersion: '1.0.0'
    }
  }
}

/**
 * Restore data from backup
 * @param {File} file - Backup file to restore
 * @returns {Promise<Object>} - Restored data with validation
 */
export const restoreFromBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result)
        
        // Validate backup structure
        if (!backup.data || !backup.data.deals) {
          throw new Error('Invalid backup format')
        }
        
        resolve({
          success: true,
          data: backup.data,
          metadata: backup.metadata || {},
          backupDate: backup.backupDate
        })
      } catch (error) {
        reject({
          success: false,
          error: error.message
        })
      }
    }
    
    reader.onerror = () => {
      reject({
        success: false,
        error: 'Failed to read backup file'
      })
    }
    
    reader.readAsText(file)
  })
}

/**
 * Validate deal data structure
 * @param {Object} deal - Deal object to validate
 * @returns {Object} - Validation result
 */
export const validateDeal = (deal) => {
  const errors = []
  const warnings = []
  
  // Required fields
  if (!deal.id) errors.push('Missing ID')
  if (!deal.vehicle) errors.push('Missing vehicle data')
  if (!deal.vehicle?.year) errors.push('Missing vehicle year')
  if (!deal.vehicle?.make) errors.push('Missing vehicle make')
  if (!deal.vehicle?.model) errors.push('Missing vehicle model')
  if (!deal.vehicle?.mileage) errors.push('Missing vehicle mileage')
  if (!deal.vehicle?.zip) errors.push('Missing ZIP code')
  if (!deal.condition?.rating) errors.push('Missing condition rating')
  if (!deal.price) errors.push('Missing price data')
  if (!deal.status) errors.push('Missing status')
  
  // Data type validation
  if (deal.vehicle?.year && (isNaN(deal.vehicle.year) || deal.vehicle.year < 1900 || deal.vehicle.year > new Date().getFullYear() + 1)) {
    warnings.push('Invalid vehicle year')
  }
  
  if (deal.vehicle?.mileage && (isNaN(deal.vehicle.mileage) || deal.vehicle.mileage < 0)) {
    warnings.push('Invalid mileage')
  }
  
  if (deal.condition?.rating && (isNaN(deal.condition.rating) || deal.condition.rating < 1 || deal.condition.rating > 5)) {
    warnings.push('Invalid condition rating')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Clean and sanitize deal data
 * @param {Object} deal - Deal object to clean
 * @returns {Object} - Cleaned deal object
 */
export const sanitizeDeal = (deal) => {
  return {
    ...deal,
    id: deal.id?.toString() || Date.now().toString(),
    vehicle: {
      year: parseInt(deal.vehicle?.year) || new Date().getFullYear(),
      make: deal.vehicle?.make?.toString().trim() || '',
      model: deal.vehicle?.model?.toString().trim() || '',
      trim: deal.vehicle?.trim?.toString().trim() || '',
      mileage: parseInt(deal.vehicle?.mileage) || 0,
      zip: deal.vehicle?.zip?.toString().trim() || ''
    },
    condition: {
      rating: Math.max(1, Math.min(5, parseInt(deal.condition?.rating) || 3)),
      flags: Array.isArray(deal.condition?.flags) ? deal.condition.flags : []
    },
    photos: Array.isArray(deal.photos) ? deal.photos : [],
    price: {
      low: parseInt(deal.price?.low) || 0,
      mid: parseInt(deal.price?.mid) || 0,
      high: parseInt(deal.price?.high) || 0,
      explanation: deal.price?.explanation || ''
    },
    status: deal.status || 'researching',
    notes: deal.notes?.toString().trim() || '',
    createdAt: deal.createdAt || new Date().toISOString(),
    updatedAt: deal.updatedAt || new Date().toISOString()
  }
}
