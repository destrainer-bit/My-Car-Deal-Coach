// Image compression and optimization utilities

/**
 * Compress an image file to reduce file size
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} maxHeight - Maximum height in pixels
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      // Set canvas dimensions
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Convert file to data URL
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Data URL string
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Get optimal image dimensions for display
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {number} maxWidth - Maximum display width
 * @param {number} maxHeight - Maximum display height
 * @returns {Object} - Optimal width and height
 */
export const getOptimalDimensions = (originalWidth, originalHeight, maxWidth = 400, maxHeight = 300) => {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight)
  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio)
  }
}

/**
 * Generate a thumbnail from an image
 * @param {string} dataUrl - Image data URL
 * @param {number} size - Thumbnail size (square)
 * @returns {Promise<string>} - Thumbnail data URL
 */
export const generateThumbnail = (dataUrl, size = 150) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      
      // Draw image centered and cropped to square
      const minDimension = Math.min(img.width, img.height)
      const x = (img.width - minDimension) / 2
      const y = (img.height - minDimension) / 2
      
      ctx.drawImage(img, x, y, minDimension, minDimension, 0, 0, size, size)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    
    img.src = dataUrl
  })
}

/**
 * Check if image needs compression
 * @param {File} file - The image file
 * @param {number} maxSizeKB - Maximum file size in KB
 * @returns {boolean} - Whether compression is needed
 */
export const needsCompression = (file, maxSizeKB = 500) => {
  return file.size > maxSizeKB * 1024
}

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
