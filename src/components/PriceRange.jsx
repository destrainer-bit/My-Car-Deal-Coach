import React from 'react'
import './price-range.css'

function PriceRange({ price }) {
  if (!price) {
    return (
      <div className="price-range">
        <div className="price-range__error">
          <p>Unable to calculate pricing</p>
        </div>
      </div>
    )
  }

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="price-range">
      <div className="price-range__header">
        <h3>Estimated Price Range</h3>
        {price.isRealData && (
          <div className="price-range__badge">
            <span className="badge badge--success">Real Market Data</span>
          </div>
        )}
      </div>
      
      <div className="price-range__values">
        <div className="price-range__value price-range__value--low">
          <div className="price-range__label">Low End</div>
          <div className="price-range__amount">{formatPrice(price.low)}</div>
        </div>
        
        <div className="price-range__value price-range__value--mid">
          <div className="price-range__label">Market Average</div>
          <div className="price-range__amount">{formatPrice(price.mid)}</div>
        </div>
        
        <div className="price-range__value price-range__value--high">
          <div className="price-range__label">High End</div>
          <div className="price-range__amount">{formatPrice(price.high)}</div>
        </div>
      </div>
      
      {price.explanation && (
        <div className="price-range__explanation">
          <p>{price.explanation}</p>
        </div>
      )}
      
      {price.count && (
        <div className="price-range__source">
          <p>Based on {price.count} listings from {price.source}</p>
        </div>
      )}
    </div>
  )
}

export default PriceRange