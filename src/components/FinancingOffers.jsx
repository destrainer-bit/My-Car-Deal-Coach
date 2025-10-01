import React, { useState, useEffect } from 'react'
import { financingAPI } from '../lib/financingAPI.js'
import { triggerHaptic } from '../lib/gestures.js'

function FinancingOffers({ isOpen, onClose, vehicleData }) {
  const [loading, setLoading] = useState(false)
  const [offers, setOffers] = useState(null)
  const [error, setError] = useState(null)
  const [loanRequest, setLoanRequest] = useState({
    loanAmount: 25000,
    term: 60,
    creditScore: 700,
    downPayment: 5000,
    income: 60000,
    debtToIncomeRatio: 0.3,
    employmentHistory: 2
  })
  const [showPreQual, setShowPreQual] = useState(false)
  const [preQualResult, setPreQualResult] = useState(null)

  const handleLoanRequestChange = (field, value) => {
    setLoanRequest(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const fetchFinancingOffers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      triggerHaptic('light')
      const data = await financingAPI.getFinancingOffers(loanRequest)
      setOffers(data)
      triggerHaptic('success')
    } catch (err) {
      setError(err.message)
      triggerHaptic('error')
    } finally {
      setLoading(false)
    }
  }

  const handlePreQualification = async () => {
    setLoading(true)
    setError(null)
    
    try {
      triggerHaptic('light')
      const result = await financingAPI.getPreQualification(loanRequest)
      setPreQualResult(result)
      setShowPreQual(true)
      triggerHaptic('success')
    } catch (err) {
      setError(err.message)
      triggerHaptic('error')
    } finally {
      setLoading(false)
    }
  }

  const calculatePayment = (principal, rate, term) => {
    if (rate === 0) {
      return principal / term
    }
    
    const monthlyRate = rate / 12
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1)
    
    return Math.round(monthlyPayment * 100) / 100
  }

  useEffect(() => {
    if (isOpen && vehicleData) {
      // Set loan amount based on vehicle price if available
      if (vehicleData.price?.mid) {
        setLoanRequest(prev => ({
          ...prev,
          loanAmount: vehicleData.price.mid
        }))
      }
    }
  }, [isOpen, vehicleData])

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
          {/* Loan Request Form */}
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
                className="btn btn-secondary"
                onClick={handlePreQualification}
                disabled={loading}
              >
                Pre-Qualify
              </button>
              <button 
                className="btn btn-primary"
                onClick={fetchFinancingOffers}
                disabled={loading}
              >
                Get Offers
              </button>
            </div>
          </div>

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
              <p>Getting financing offers...</p>
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
              <button className="btn btn-primary" onClick={fetchFinancingOffers}>
                Try Again
              </button>
            </div>
          )}

          {/* Pre-Qualification Results */}
          {showPreQual && preQualResult && (
            <div className="pre-qual-results">
              <h3>Pre-Qualification Results</h3>
              <div className={`pre-qual-card ${preQualResult.approved ? 'approved' : 'denied'}`}>
                <div className="pre-qual-header">
                  <h4>{preQualResult.approved ? '✅ Pre-Qualified' : '❌ Not Pre-Qualified'}</h4>
                  <span className="score">Score: {preQualResult.score}</span>
                </div>
                
                {preQualResult.approved && (
                  <div className="pre-qual-details">
                    <p><strong>Max Loan Amount:</strong> ${preQualResult.maxLoanAmount.toLocaleString()}</p>
                    <p><strong>Recommended Term:</strong> {preQualResult.recommendedTerm} months</p>
                  </div>
                )}
                
                <div className="next-steps">
                  <h5>Next Steps:</h5>
                  <ul>
                    {preQualResult.nextSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Financing Offers */}
          {offers && (
            <div className="financing-offers">
              <h3>Financing Offers ({offers.totalOffers} found)</h3>
              
              {offers.bestOffer && (
                <div className="best-offer">
                  <h4>🏆 Best Offer</h4>
                  <div className="offer-card best">
                    <div className="offer-header">
                      <h5>{offers.bestOffer.partnerName}</h5>
                      <span className="rate">{(offers.bestOffer.interestRate * 100).toFixed(2)}% APR</span>
                    </div>
                    <div className="offer-details">
                      <div className="payment-info">
                        <span className="monthly-payment">${offers.bestOffer.monthlyPayment.toLocaleString()}</span>
                        <span className="payment-label">/month</span>
                      </div>
                      <div className="offer-meta">
                        <span>Total Interest: ${offers.bestOffer.totalInterest.toLocaleString()}</span>
                        <span>Total Cost: ${offers.bestOffer.totalCost.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="offer-features">
                      {offers.bestOffer.features.map((feature, i) => (
                        <span key={i} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                    <div className="offer-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => window.open(offers.bestOffer.applicationUrl)}
                      >
                        Apply Now
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => window.open(`tel:${offers.bestOffer.phoneNumber}`)}
                      >
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="all-offers">
                <h4>All Offers</h4>
                {offers.offers.map((offer, index) => (
                  <div key={index} className="offer-card">
                    <div className="offer-header">
                      <h5>{offer.partnerName}</h5>
                      <span className="rate">{(offer.interestRate * 100).toFixed(2)}% APR</span>
                    </div>
                    <div className="offer-details">
                      <div className="payment-info">
                        <span className="monthly-payment">${offer.monthlyPayment.toLocaleString()}</span>
                        <span className="payment-label">/month</span>
                      </div>
                      <div className="offer-meta">
                        <span>Term: {offer.term} months</span>
                        <span>Total Interest: ${offer.totalInterest.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="offer-features">
                      {offer.features.map((feature, i) => (
                        <span key={i} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                    <div className="offer-actions">
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => window.open(offer.applicationUrl)}
                      >
                        Apply
                      </button>
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => window.open(`tel:${offer.phoneNumber}`)}
                      >
                        Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default FinancingOffers
