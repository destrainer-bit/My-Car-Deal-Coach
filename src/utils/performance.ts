/**
 * Performance utilities for Car Deal Coach
 */

// Image optimization
export function optimizeImageUrl(url: string, width?: number, height?: number): string {
  if (!url) return url
  
  // Add image optimization parameters
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', '80') // Quality
  params.set('f', 'auto') // Format
  
  return `${url}?${params.toString()}`
}

// Memory management
export function clearUnusedData() {
  // Clear unused images from memory
  if ('memory' in performance) {
    const memInfo = (performance as any).memory
    if (memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.8) {
      // Force garbage collection if memory usage is high
      if ('gc' in window) {
        (window as any).gc()
      }
    }
  }
}

// Bundle size optimization
export function preloadCriticalResources() {
  // Preload critical CSS
  const criticalCSS = document.createElement('link')
  criticalCSS.rel = 'preload'
  criticalCSS.href = '/src/styles/globals.css'
  criticalCSS.as = 'style'
  document.head.appendChild(criticalCSS)
  
  // Preload critical fonts
  const fontLink = document.createElement('link')
  fontLink.rel = 'preload'
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  fontLink.as = 'style'
  document.head.appendChild(fontLink)
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
}

// Lazy loading helper
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, options)
  }
  return null
}
