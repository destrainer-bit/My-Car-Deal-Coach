import React, { useState } from 'react'

function SimpleFinancingOffers({ isOpen, onClose, vehicleData }) {
  const [loading, setLoading] = useState(false)
  const [loanRequest, setLoanRequest] = useState({
    loanAmount: 25000,
    term: 60,
    creditScore: 700,
    downPayment: 5000
  })

  const [financingOffers, setFinancingOffers] = useState(null)

  const handleGetOffers = async () => {
    setLoading(true)
    try {
      // Use existing Coach GPT for financing analysis
      const response = await fetch('/api/coach-gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Based on credit score ${loanRequest.creditScore}, loan amount $${loanRequest.loanAmount}, term ${loanRequest.term} months, and down payment $${loanRequest.downPayment}, provide realistic interest rate estimates and financing options. Include different lender types (banks, credit unions, dealerships) and their typical rates.`
        })
      })
      
      const data = await response.json()
      setFinancingOffers(data)
    } catch (error) {
      console.error('Error fetching financing offers:', error)
      // Fallback to sample data
      setFinancingOffers({
        estimatedRate: 6.5,
        monthlyPayment: 485,
        totalInterest: 4100,
        recommendations: "Based on your credit score, you should qualify for competitive rates..."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLoanRequestChange = (field, value) => {
    setLoanRequest(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content financing-offers-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Financing Options</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="loan-request-form">
            <h3>Loan Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Loan Amount</label>
                <input
                  type="number"
                  value={loanRequest.loanAmount}
                  onChange={(e) => handleLoanRequestChange('loanAmount', parseInt(e.target.value))}
                  min="1000"
                  max="100000"
                />
              </div>
              
              <div className="form-group">
                <label>Term (months)</label>
                <select
                  value={loanRequest.term}
                  onChange={(e) => handleLoanRequestChange('term', parseInt(e.target.value))}
                >
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                  <option value="72">72 months</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Credit Score</label>
                <select
                  value={loanRequest.creditScore}
                  onChange={(e) => handleLoanRequestChange('creditScore', parseInt(e.target.value))}
                >
                  <option value="300">300-499 (Poor)</option>
                  <option value="500">500-579 (Fair)</option>
                  <option value="600">580-669 (Fair)</option>
                  <option value="700">670-739 (Good)</option>
                  <option value="750">740-799 (Very Good)</option>
                  <option value="800">800+ (Excellent)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Down Payment</label>
                <input
                  type="number"
                  value={loanRequest.downPayment}
                  onChange={(e) => handleLoanRequestChange('downPayment', parseInt(e.target.value))}
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={handleGetOffers}
                disabled={loading}
              >
                {loading ? 'Getting Offers...' : 'Get Financing Offers'}
              </button>
            </div>
          </div>

          <div className="sample-offers">
            <h3>🏦 Sample Financing Offers</h3>
            <p>This feature would connect to multiple lenders to provide real financing options.</p>
            
            <div className="offers-grid">
              <div className="offer-card best">
                <div className="offer-header">
                  <h4>🏆 Best Offer - Chase Auto Finance</h4>
                  <span className="rate">3.49% APR</span>
                </div>
                <div className="offer-details">
                  <div className="payment-info">
                    <span className="monthly-payment">$456</span>
                    <span className="payment-label">/month</span>
                  </div>
                  <div className="offer-meta">
                    <span>60 months</span>
                    <span>Total Interest: $2,360</span>
                  </div>
                </div>
                <div className="offer-features">
                  <span className="feature-tag">Online application</span>
                  <span className="feature-tag">Quick approval</span>
                </div>
              </div>

              <div className="offer-card">
                <div className="offer-header">
                  <h4>Capital One Auto Finance</h4>
                  <span className="rate">3.99% APR</span>
                </div>
                <div className="offer-details">
                  <div className="payment-info">
                    <span className="monthly-payment">$463</span>
                    <span className="payment-label">/month</span>
                  </div>
                  <div className="offer-meta">
                    <span>60 months</span>
                    <span>Total Interest: $2,780</span>
                  </div>
                </div>
                <div className="offer-features">
                  <span className="feature-tag">Pre-qualification</span>
                  <span className="feature-tag">No impact to credit</span>
                </div>
              </div>

              <div className="offer-card">
                <div className="offer-header">
                  <h4>Wells Fargo Auto</h4>
                  <span className="rate">4.49% APR</span>
                </div>
                <div className="offer-details">
                  <div className="payment-info">
                    <span className="monthly-payment">$470</span>
                    <span className="payment-label">/month</span>
                  </div>
                  <div className="offer-meta">
                    <span>60 months</span>
                    <span>Total Interest: $3,200</span>
                  </div>
                </div>
                <div className="offer-features">
                  <span className="feature-tag">Relationship discounts</span>
                  <span className="feature-tag">Auto-pay discount</span>
                </div>
              </div>
            </div>
          </div>

          <div className="market-section">
            <h3>⚠️ Note</h3>
            <p>This is a demo version. In production, this would connect to real financing partners to provide actual loan offers based on your credit profile.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimpleFinancingOffers



