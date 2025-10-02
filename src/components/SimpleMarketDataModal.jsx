import React, { useState } from 'react'

function SimpleMarketDataModal({ isOpen, onClose, vehicleData }) {
  const [loading, setLoading] = useState(false)

  const handleGetData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1500)
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
          <div className="market-data-content">
            <div className="market-section">
              <h3>📊 Sample Market Data</h3>
              <p>This feature would connect to KBB and Edmunds APIs to provide real market data.</p>
              
              <div className="sample-data">
                <div className="data-card">
                  <h4>Kelley Blue Book</h4>
                  <div className="data-item">
                    <span>Trade-in Value:</span>
                    <span>$18,500 - $22,000</span>
                  </div>
                  <div className="data-item">
                    <span>Private Party:</span>
                    <span>$20,000 - $24,000</span>
                  </div>
                </div>
                
                <div className="data-card">
                  <h4>Edmunds</h4>
                  <div className="data-item">
                    <span>True Market Value:</span>
                    <span>$21,500</span>
                  </div>
                  <div className="data-item">
                    <span>MSRP:</span>
                    <span>$28,500</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="market-section">
              <h3>💡 Recommendations</h3>
              <div className="recommendations">
                <div className="recommendation-card">
                  <h4>Fair Price Range</h4>
                  <div className="price-range">
                    <span className="range-low">$19,500</span>
                    <span className="range-separator">-</span>
                    <span className="range-high">$23,500</span>
                  </div>
                  <p className="recommended-price">Target: $21,500</p>
                </div>

                <div className="recommendation-card">
                  <h4>Negotiation Tips</h4>
                  <ul className="advice-list">
                    <li>Start negotiations at the low end of the range</li>
                    <li>Be prepared to walk away if price is too high</li>
                    <li>Consider timing - end of month/quarter is often better</li>
                    <li>Research dealer incentives and rebates</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="market-section">
              <h3>⚠️ Note</h3>
              <p>This is a demo version. In production, this would connect to real market data APIs like KBB and Edmunds to provide accurate, up-to-date valuations.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleGetData}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Live Data'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimpleMarketDataModal



