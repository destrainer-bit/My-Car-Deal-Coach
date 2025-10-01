import React, { useState, useEffect } from 'react'
import { marketDataAPI } from '../lib/marketDataAPI.js'
import { triggerHaptic } from '../lib/gestures.js'

function MarketDataModal({ isOpen, onClose, vehicleData }) {
  const [loading, setLoading] = useState(false)
  const [marketData, setMarketData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && vehicleData) {
      fetchMarketData()
    }
  }, [isOpen, vehicleData])

  const fetchMarketData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      triggerHaptic('light')
      const data = await marketDataAPI.getComprehensiveMarketData(vehicleData)
      setMarketData(data)
      triggerHaptic('success')
    } catch (err) {
      setError(err.message)
      triggerHaptic('error')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content market-data-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Market Data & Valuations</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 12 12;360 12 12"/>
                  </path>
                </svg>
              </div>
              <p>Fetching market data from KBB and Edmunds...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p>Error: {error}</p>
              <button className="btn btn-primary" onClick={fetchMarketData}>
                Try Again
              </button>
            </div>
          )}

          {marketData && (
            <div className="market-data-content">
              {/* KBB Data */}
              <div className="market-section">
                <h3>Kelley Blue Book Valuations</h3>
                <div className="valuation-grid">
                  <div className="valuation-card">
                    <h4>Trade-In Value</h4>
                    <div className="valuation-amounts">
                      <div className="valuation-item">
                        <span className="condition">Excellent</span>
                        <span className="amount">${marketData.sources.kbb.valuations.tradeIn.excellent.toLocaleString()}</span>
                      </div>
                      <div className="valuation-item">
                        <span className="condition">Good</span>
                        <span className="amount">${marketData.sources.kbb.valuations.tradeIn.good.toLocaleString()}</span>
                      </div>
                      <div className="valuation-item">
                        <span className="condition">Fair</span>
                        <span className="amount">${marketData.sources.kbb.valuations.tradeIn.fair.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="valuation-card">
                    <h4>Private Party</h4>
                    <div className="valuation-amounts">
                      <div className="valuation-item">
                        <span className="condition">Excellent</span>
                        <span className="amount">${marketData.sources.kbb.valuations.privateParty.excellent.toLocaleString()}</span>
                      </div>
                      <div className="valuation-item">
                        <span className="condition">Good</span>
                        <span className="amount">${marketData.sources.kbb.valuations.privateParty.good.toLocaleString()}</span>
                      </div>
                      <div className="valuation-item">
                        <span className="condition">Fair</span>
                        <span className="amount">${marketData.sources.kbb.valuations.privateParty.fair.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="valuation-card">
                    <h4>Dealer Retail</h4>
                    <div className="valuation-amounts">
                      <div className="valuation-item">
                        <span className="condition">Excellent</span>
                        <span className="amount">${marketData.sources.kbb.valuations.dealerRetail.excellent.toLocaleString()}</span>
                      </div>
                      <div className="valuation-item">
                        <span className="condition">Good</span>
                        <span className="amount">${marketData.sources.kbb.valuations.dealerRetail.good.toLocaleString()}</span>
                      </div>
                      <div className="valuation-item">
                        <span className="condition">Fair</span>
                        <span className="amount">${marketData.sources.kbb.valuations.dealerRetail.fair.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edmunds Data */}
              <div className="market-section">
                <h3>Edmunds Information</h3>
                <div className="edmunds-grid">
                  <div className="edmunds-card">
                    <h4>Pricing</h4>
                    <div className="pricing-info">
                      <div className="price-item">
                        <span>MSRP</span>
                        <span>${marketData.sources.edmunds.vehicle.msrp.toLocaleString()}</span>
                      </div>
                      <div className="price-item">
                        <span>Invoice</span>
                        <span>${marketData.sources.edmunds.vehicle.invoice.toLocaleString()}</span>
                      </div>
                      <div className="price-item">
                        <span>True Market Value</span>
                        <span>${marketData.sources.edmunds.vehicle.trueMarketValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="edmunds-card">
                    <h4>Reviews</h4>
                    <div className="review-info">
                      <div className="review-item">
                        <span>Overall Rating</span>
                        <span className="rating">{marketData.sources.edmunds.reviews.overallRating}/5.0</span>
                      </div>
                      <div className="review-item">
                        <span>Reliability</span>
                        <span className="reliability">{marketData.sources.edmunds.reviews.reliability}</span>
                      </div>
                      <div className="review-item">
                        <span>Value</span>
                        <span className="value">{marketData.sources.edmunds.reviews.value}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="market-section">
                <h3>Our Recommendations</h3>
                <div className="recommendations">
                  <div className="recommendation-card">
                    <h4>Fair Price Range</h4>
                    <div className="price-range">
                      <span className="range-low">${marketData.recommendations.negotiationRange.low.toLocaleString()}</span>
                      <span className="range-separator">-</span>
                      <span className="range-high">${marketData.recommendations.negotiationRange.high.toLocaleString()}</span>
                    </div>
                    <p className="recommended-price">Target: ${marketData.recommendations.fairPrice.toLocaleString()}</p>
                  </div>

                  <div className="recommendation-card">
                    <h4>Negotiation Advice</h4>
                    <ul className="advice-list">
                      {marketData.recommendations.advice.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Market Summary */}
              <div className="market-section">
                <h3>Market Summary</h3>
                <div className="market-summary">
                  <div className="summary-item">
                    <span>Market Condition</span>
                    <span className={`condition ${marketData.marketSummary.marketCondition}`}>
                      {marketData.marketSummary.marketCondition === 'seller' ? 'Seller\'s Market' : 'Buyer\'s Market'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Price Trend</span>
                    <span className={`trend ${marketData.marketSummary.priceTrend}`}>
                      {marketData.marketSummary.priceTrend}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Reliability</span>
                    <span className="reliability">{marketData.marketSummary.reliability}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {marketData && (
            <button className="btn btn-primary" onClick={fetchMarketData}>
              Refresh Data
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketDataModal
