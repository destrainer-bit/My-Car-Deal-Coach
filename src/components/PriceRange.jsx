import React from 'react'
import { formatPrice } from '../lib/pricing.js'

function PriceRange({ price }) {
  if (!price || !price.low || !price.mid || !price.high) {
    return (
      <div className="price-range">
        <div className="price-error">Price not available</div>
      </div>
    )
  }

  const getPriceColor = (value, low, mid, high) => {
    if (value <= low) return 'var(--color-success)'
    if (value <= mid) return 'var(--color-warning)'
    return 'var(--color-danger)'
  }

  return (
    <div className="price-range">
      <div className="price-header">
        <h4>Estimated Price Range</h4>
        {price.explanation && (
          <p className="price-explanation">{price.explanation}</p>
        )}
      </div>
      
      <div className="price-values">
        <div className="price-item low">
          <span className="price-label">Low</span>
          <span className="price-value">{formatPrice(price.low)}</span>
        </div>
        
        <div className="price-item mid">
          <span className="price-label">Likely</span>
          <span className="price-value">{formatPrice(price.mid)}</span>
        </div>
        
        <div className="price-item high">
          <span className="price-label">High</span>
          <span className="price-value">{formatPrice(price.high)}</span>
        </div>
      </div>

      <div className="price-range-bar">
        <div className="range-track">
          <div 
            className="range-fill"
            style={{
              left: '0%',
              width: '100%',
              background: `linear-gradient(to right, 
                var(--color-success) 0%, 
                var(--color-warning) 50%, 
                var(--color-danger) 100%)`
            }}
          />
          <div 
            className="range-marker low"
            style={{ left: '0%' }}
          />
          <div 
            className="range-marker mid"
            style={{ left: '50%' }}
          />
          <div 
            className="range-marker high"
            style={{ left: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}

export default PriceRange