import React, { useState } from 'react'
import PriceRange from './PriceRange.jsx'
import RangeBadge from './RangeBadge.jsx'

function DealComparison({ deals, onClose }) {
  console.log('DealComparison rendering with deals:', deals)
  const [selectedDeals, setSelectedDeals] = useState([])

  const toggleDeal = (deal) => {
    if (selectedDeals.find(d => d.id === deal.id)) {
      setSelectedDeals(selectedDeals.filter(d => d.id !== deal.id))
    } else if (selectedDeals.length < 3) {
      setSelectedDeals([...selectedDeals, deal])
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const calculateSavings = (deal) => {
    const midPrice = deal.price?.mid || deal.price?.asking || 0
    const highPrice = deal.price?.high || deal.price?.asking || 0
    return highPrice - midPrice
  }

  const getBestDeal = () => {
    if (selectedDeals.length === 0) return null
    return selectedDeals.reduce((best, current) => {
      const currentPrice = current.price?.mid || current.price?.asking || 0
      const bestPrice = best.price?.mid || best.price?.asking || 0
      return currentPrice < bestPrice ? current : best
    })
  }

  const bestDeal = getBestDeal()

  if (!deals || deals.length === 0) {
    return (
      <div className="deal-comparison">
        <div className="comparison-header">
          <h3>🔍 Deal Comparison</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="no-deals">
          <p>No deals available for comparison. Create some deals first!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="deal-comparison" style={{ background: '#1a1a1a', color: '#ffffff', padding: '20px', minHeight: '400px' }}>
      <div className="comparison-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#ffffff', margin: 0 }}>🔍 Deal Comparison</h3>
        <button className="close-btn" onClick={onClose} style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="comparison-instructions" style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ color: '#ffffff', margin: '0 0 10px 0' }}>Select up to 3 deals to compare side-by-side</p>
        <div className="selection-count" style={{ background: '#3b82f6', color: '#ffffff', padding: '5px 10px', borderRadius: '4px', display: 'inline-block' }}>
          {selectedDeals.length}/3 selected
        </div>
      </div>

      <div className="deals-grid">
        {deals.map(deal => (
          <div 
            key={deal.id}
            className={`deal-card ${selectedDeals.find(d => d.id === deal.id) ? 'selected' : ''}`}
            onClick={() => toggleDeal(deal)}
          >
            <div className="deal-header">
              <h4>{deal.vehicle.year} {deal.vehicle.make} {deal.vehicle.model}</h4>
              <RangeBadge status={deal.status} />
            </div>
            
            <div className="deal-details">
              <div className="detail-row">
                <span>Trim:</span>
                <span>{deal.vehicle.trim}</span>
              </div>
              <div className="detail-row">
                <span>Mileage:</span>
                <span>{parseInt(deal.vehicle.mileage).toLocaleString()} mi</span>
              </div>
              <div className="detail-row">
                <span>Condition:</span>
                <span>{deal.condition?.rating || 'N/A'}/5</span>
              </div>
            </div>

            <div className="deal-pricing">
              <PriceRange price={deal.price} />
              <div className="savings">
                Potential savings: {formatPrice(calculateSavings(deal))}
              </div>
            </div>

            {selectedDeals.find(d => d.id === deal.id) && (
              <div className="selected-indicator">
                ✓ Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDeals.length > 0 && (
        <div className="comparison-results">
          <h4>📊 Comparison Results</h4>
          
          <div className="comparison-table">
            <div className="table-header">
              <div>Vehicle</div>
              <div>Price Range</div>
              <div>Monthly Payment*</div>
              <div>Value Score</div>
            </div>
            
            {selectedDeals.map(deal => (
              <div key={deal.id} className={`table-row ${deal.id === bestDeal?.id ? 'best-deal' : ''}`}>
                <div className="vehicle-info">
                  <strong>{deal.vehicle.year} {deal.vehicle.make} {deal.vehicle.model}</strong>
                  <small>{deal.vehicle.trim} • {parseInt(deal.vehicle.mileage).toLocaleString()} mi</small>
                </div>
                <div className="price-range">
                  {formatPrice(deal.price?.low || deal.price?.asking || 0)} - {formatPrice(deal.price?.high || deal.price?.asking || 0)}
                </div>
                <div className="monthly-payment">
                  {formatPrice((deal.price?.mid || deal.price?.asking || 0) / 60)}/mo
                </div>
                <div className="value-score">
                  {Math.round(((deal.condition?.rating || 3) / 5) * 100)}%
                </div>
              </div>
            ))}
          </div>

          {bestDeal && (
            <div className="best-deal-highlight">
              <h5>🏆 Best Value: {bestDeal.vehicle.year} {bestDeal.vehicle.make} {bestDeal.vehicle.model}</h5>
              <p>Lowest price with good condition rating</p>
            </div>
          )}

          <div className="comparison-notes">
            <small>* Monthly payment calculated at 60 months, 6.5% APR</small>
          </div>
        </div>
      )}
    </div>
  )
}

export default DealComparison
