import React, { useState, useEffect } from 'react'

function FinanceEstimator({ onClose, onEstimate }) {
  const [formData, setFormData] = useState({
    vehiclePrice: '',
    downPayment: '',
    creditScore: '',
    loanTerm: 60,
    vehicleType: 'used',
    lenderType: 'bank',
    includeInsurance: true,
    includeWarranties: false,
    state: 'CA'
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // API configuration
  const API_BASE = import.meta.env.DEV 
    ? 'http://localhost:8787' 
    : 'https://your-vercel-domain.vercel.app'

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/pricing-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: 'GA',
          score: parseInt(formData.creditScore),
          vehiclePrice: parseFloat(formData.vehiclePrice),
          downPayment: parseFloat(formData.downPayment) || 0,
          tradeInValue: 0,
          estTaxesAndFees: 1200,
          term: parseInt(formData.loanTerm),
          vehicleYear: 2018,
          mileage: 80000,
          product: formData.vehicleType === 'new' ? 'auto-new' : 'auto-used'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate financing')
      }

      setResult(data)
      if (onEstimate) {
        onEstimate(data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (rate) => {
    return `${(rate * 100).toFixed(2)}%`
  }

  return (
    <div className="finance-estimator">
      <div className="finance-header">
        <h2 style={{ color: '#ffffff' }}>💰 Finance Calculator</h2>
        <p style={{ color: '#ffffff' }}>Get an instant financing estimate for your car purchase</p>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="finance-form">
        <div className="form-grid">
          <div className="form-group">
            <label style={{ color: '#ffffff' }}>Vehicle Price ($)</label>
            <input
              type="number"
              value={formData.vehiclePrice}
              onChange={(e) => handleInputChange('vehiclePrice', e.target.value)}
              placeholder="e.g., 25000"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ color: '#ffffff' }}>Down Payment ($)</label>
            <input
              type="number"
              value={formData.downPayment}
              onChange={(e) => handleInputChange('downPayment', e.target.value)}
              placeholder="e.g., 5000"
            />
          </div>

          <div className="form-group">
            <label style={{ color: '#ffffff' }}>Credit Score</label>
            <input
              type="number"
              value={formData.creditScore}
              onChange={(e) => handleInputChange('creditScore', e.target.value)}
              placeholder="e.g., 720"
              min="300"
              max="850"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ color: '#ffffff' }}>Loan Term (months)</label>
            <select
              value={formData.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value))}
            >
              <option value={36}>36 months</option>
              <option value={48}>48 months</option>
              <option value={60}>60 months</option>
              <option value={72}>72 months</option>
              <option value={84}>84 months</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ color: '#ffffff' }}>Vehicle Type</label>
            <select
              value={formData.vehicleType}
              onChange={(e) => handleInputChange('vehicleType', e.target.value)}
            >
              <option value="new">New Vehicle</option>
              <option value="used">Used Vehicle</option>
              <option value="certified">Certified Pre-Owned</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ color: '#ffffff' }}>Lender Type</label>
            <select
              value={formData.lenderType}
              onChange={(e) => handleInputChange('lenderType', e.target.value)}
            >
              <option value="creditUnion">Credit Union</option>
              <option value="bank">Bank</option>
              <option value="dealer">Dealer Financing</option>
              <option value="online">Online Lender</option>
            </select>
          </div>
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeInsurance}
              onChange={(e) => handleInputChange('includeInsurance', e.target.checked)}
            />
            <span style={{ color: '#ffffff' }}>Include Insurance Estimate</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.includeWarranties}
              onChange={(e) => handleInputChange('includeWarranties', e.target.checked)}
            />
            <span style={{ color: '#ffffff' }}>Include Warranty Options</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Financing'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <p style={{ color: '#ff4444' }}>❌ {error}</p>
        </div>
      )}

      {result && (
        <div className="finance-results">
          <h3 style={{ color: '#ffffff' }}>📊 Your Financing Estimate</h3>
          
          <div className="credit-band">
            <h4 style={{ color: '#0B84FE' }}>Credit Score Range: {result.band.label}</h4>
            <p style={{ color: '#ffffff' }}>Score: {result.inputs.score}</p>
          </div>

          <div className="lender-results">
            <h4 style={{ color: '#ffffff' }}>🏦 Available Lenders</h4>
            <div className="lender-grid">
              {result.results.map((lender, index) => (
                <div key={lender.lenderId} className="lender-card">
                  <h5 style={{ color: '#0B84FE' }}>{lender.lenderName}</h5>
                  <div className="lender-details">
                    <div className="rate-range">
                      <span style={{ color: '#ffffff' }}>Rate: {(lender.aprLow * 100).toFixed(2)}% - {(lender.aprHigh * 100).toFixed(2)}%</span>
                    </div>
                    <div className="payment-range">
                      <span style={{ color: '#ffffff' }}>Payment: {formatCurrency(lender.paymentLow)} - {formatCurrency(lender.paymentHigh)}</span>
                    </div>
                    <div className="loan-amount">
                      <span style={{ color: '#ffffff' }}>Loan Amount: {formatCurrency(lender.loanAmount)}</span>
                    </div>
                    {lender.notes.length > 0 && (
                      <div className="lender-notes">
                        {lender.notes.map((note, noteIndex) => (
                          <span key={noteIndex} className="note" style={{ color: '#FF6B35' }}>• {note}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="input-summary">
            <h4 style={{ color: '#ffffff' }}>📋 Your Inputs</h4>
            <div className="input-grid">
              <div className="input-item">
                <span style={{ color: '#ffffff' }}>Vehicle Price:</span>
                <span style={{ color: '#ffffff' }}>{formatCurrency(result.inputs.vehiclePrice)}</span>
              </div>
              <div className="input-item">
                <span style={{ color: '#ffffff' }}>Down Payment:</span>
                <span style={{ color: '#ffffff' }}>{formatCurrency(result.inputs.downPayment)}</span>
              </div>
              <div className="input-item">
                <span style={{ color: '#ffffff' }}>Trade-in Value:</span>
                <span style={{ color: '#ffffff' }}>{formatCurrency(result.inputs.tradeInValue)}</span>
              </div>
              <div className="input-item">
                <span style={{ color: '#ffffff' }}>Taxes & Fees:</span>
                <span style={{ color: '#ffffff' }}>{formatCurrency(result.inputs.estTaxesAndFees)}</span>
              </div>
              <div className="input-item">
                <span style={{ color: '#ffffff' }}>Loan Term:</span>
                <span style={{ color: '#ffffff' }}>{result.inputs.term} months</span>
              </div>
              <div className="input-item">
                <span style={{ color: '#ffffff' }}>Vehicle Year:</span>
                <span style={{ color: '#ffffff' }}>{result.inputs.vehicleYear}</span>
              </div>
              <div className="input-item">
                <span style={{ color: '#ffffff' }}>Mileage:</span>
                <span style={{ color: '#ffffff' }}>{result.inputs.mileage.toLocaleString()} miles</span>
              </div>
              <div className="input-item">
                <span style={{ color: '#ffffff' }}>Product Type:</span>
                <span style={{ color: '#ffffff' }}>{result.inputs.product}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinanceEstimator
