import React from 'react'

function AnalyticsDashboard({ deals, onClose }) {
  const getAnalytics = () => {
    const totalDeals = deals.length
    const purchasedDeals = deals.filter(deal => deal.status === 'purchased')
    const researchingDeals = deals.filter(deal => deal.status === 'researching')
    const visitingDeals = deals.filter(deal => deal.status === 'visiting')
    const walkedAwayDeals = deals.filter(deal => deal.status === 'walked_away')
    
    // Price analytics
    const totalSpent = purchasedDeals.reduce((sum, deal) => sum + deal.price.mid, 0)
    const averagePrice = totalSpent / purchasedDeals.length || 0
    const highestPrice = Math.max(...deals.map(deal => deal.price.mid), 0)
    const lowestPrice = Math.min(...deals.map(deal => deal.price.mid), 0)
    
    // Savings analysis
    const totalPotentialSavings = deals.reduce((sum, deal) => {
      return sum + (deal.price.high - deal.price.mid)
    }, 0)
    
    // Status distribution
    const statusDistribution = {
      researching: researchingDeals.length,
      visiting: visitingDeals.length,
      pending_finance: deals.filter(deal => deal.status === 'pending_finance').length,
      walked_away: walkedAwayDeals.length,
      purchased: purchasedDeals.length
    }
    
    // Make distribution
    const makeDistribution = {}
    deals.forEach(deal => {
      const make = deal.vehicle.make
      makeDistribution[make] = (makeDistribution[make] || 0) + 1
    })
    
    // Year distribution
    const yearDistribution = {}
    deals.forEach(deal => {
      const year = deal.vehicle.year
      yearDistribution[year] = (yearDistribution[year] || 0) + 1
    })
    
    return {
      totalDeals,
      purchasedDeals: purchasedDeals.length,
      totalSpent,
      averagePrice,
      highestPrice,
      lowestPrice,
      totalPotentialSavings,
      statusDistribution,
      makeDistribution,
      yearDistribution
    }
  }

  const analytics = getAnalytics()
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)

  const getStatusColor = (status) => {
    const colors = {
      researching: '#3b82f6',
      visiting: '#f59e0b',
      pending_finance: '#f97316',
      walked_away: '#ef4444',
      purchased: '#10b981'
    }
    return colors[status] || '#6b7280'
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h3>📊 Deal Analytics</h3>
        <button className="close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="analytics-grid">
        {/* Overview Cards */}
        <div className="analytics-section">
          <h4>📈 Overview</h4>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{analytics.totalDeals}</div>
              <div className="stat-label">Total Deals</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.purchasedDeals}</div>
              <div className="stat-label">Purchased</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatCurrency(analytics.totalSpent)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatCurrency(analytics.averagePrice)}</div>
              <div className="stat-label">Avg Price</div>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="analytics-section">
          <h4>💰 Price Analysis</h4>
          <div className="price-range">
            <div className="price-item">
              <span className="price-label">Highest:</span>
              <span className="price-value">{formatCurrency(analytics.highestPrice)}</span>
            </div>
            <div className="price-item">
              <span className="price-label">Lowest:</span>
              <span className="price-value">{formatCurrency(analytics.lowestPrice)}</span>
            </div>
            <div className="price-item highlight">
              <span className="price-label">Potential Savings:</span>
              <span className="price-value">{formatCurrency(analytics.totalPotentialSavings)}</span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="analytics-section">
          <h4>📊 Status Distribution</h4>
          <div className="status-chart">
            {Object.entries(analytics.statusDistribution).map(([status, count]) => (
              <div key={status} className="status-bar">
                <div className="status-info">
                  <span className="status-label">{status.replace('_', ' ')}</span>
                  <span className="status-count">{count}</span>
                </div>
                <div className="status-progress">
                  <div 
                    className="status-fill"
                    style={{
                      width: `${(count / analytics.totalDeals) * 100}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Make Distribution */}
        <div className="analytics-section">
          <h4>🚗 Popular Makes</h4>
          <div className="make-list">
            {Object.entries(analytics.makeDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([make, count]) => (
                <div key={make} className="make-item">
                  <span className="make-name">{make}</span>
                  <span className="make-count">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Year Distribution */}
        <div className="analytics-section">
          <h4>📅 Year Trends</h4>
          <div className="year-list">
            {Object.entries(analytics.yearDistribution)
              .sort(([a], [b]) => b - a)
              .slice(0, 5)
              .map(([year, count]) => (
                <div key={year} className="year-item">
                  <span className="year-name">{year}</span>
                  <span className="year-count">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Insights */}
        <div className="analytics-section insights">
          <h4>💡 Insights</h4>
          <div className="insights-list">
            {analytics.purchasedDeals > 0 && (
              <div className="insight-item">
                <span className="insight-icon">🎯</span>
                <span className="insight-text">
                  You've purchased {analytics.purchasedDeals} car{analytics.purchasedDeals !== 1 ? 's' : ''} for an average of {formatCurrency(analytics.averagePrice)}
                </span>
              </div>
            )}
            {analytics.totalPotentialSavings > 0 && (
              <div className="insight-item">
                <span className="insight-icon">💰</span>
                <span className="insight-text">
                  Potential savings of {formatCurrency(analytics.totalPotentialSavings)} across all deals
                </span>
              </div>
            )}
            {analytics.researchingDeals > 0 && (
              <div className="insight-item">
                <span className="insight-icon">🔍</span>
                <span className="insight-text">
                  {analytics.researchingDeals} deal{analytics.researchingDeals !== 1 ? 's' : ''} still in research phase
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
