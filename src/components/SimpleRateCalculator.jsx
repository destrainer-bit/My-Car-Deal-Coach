import React, { useState } from 'react'

function SimpleRateCalculator({ onClose }) {
  const [formData, setFormData] = useState({
    creditScore: '',
    loanAmount: '',
    loanTerm: 60
  })

  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const getInterestRate = (creditScore) => {
    if (creditScore >= 800) return 0.045 // 4.5%
    if (creditScore >= 740) return 0.055 // 5.5%
    if (creditScore >= 680) return 0.065 // 6.5%
    if (creditScore >= 620) return 0.085 // 8.5%
    if (creditScore >= 580) return 0.105 // 10.5%
    return 0.125 // 12.5%
  }

  const calculateMonthlyPayment = (principal, annualRate, months) => {
    if (annualRate === 0) return principal / months
    
    const monthlyRate = annualRate / 12
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  const handleCalculate = (e) => {
    e.preventDefault()
    setError(null)

    try {
      const creditScore = parseInt(formData.creditScore)
      const loanAmount = parseFloat(formData.loanAmount)
      const loanTerm = parseInt(formData.loanTerm)

      if (!creditScore || !loanAmount || !loanTerm) {
        throw new Error('Please fill in all fields')
      }

      if (creditScore < 300 || creditScore > 850) {
        throw new Error('Credit score must be between 300 and 850')
      }

      if (loanAmount <= 0) {
        throw new Error('Loan amount must be greater than 0')
      }

      if (loanTerm < 12 || loanTerm > 120) {
        throw new Error('Loan term must be between 12 and 120 months')
      }

      const interestRate = getInterestRate(creditScore)
      const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm)
      const totalPayments = monthlyPayment * loanTerm
      const totalInterest = totalPayments - loanAmount

      setResult({
        creditScore,
        loanAmount,
        loanTerm,
        interestRate,
        monthlyPayment,
        totalPayments,
        totalInterest
      })
    } catch (err) {
      setError(err.message)
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

  const getCreditRating = (score) => {
    if (score >= 800) return 'Excellent'
    if (score >= 740) return 'Very Good'
    if (score >= 680) return 'Good'
    if (score >= 620) return 'Fair'
    if (score >= 580) return 'Poor'
    return 'Very Poor'
  }

  return (
    <div className="simple-rate-calculator">
      <div className="calculator-header">
        <h3>💰 Quick Rate Calculator</h3>
        <p>Enter your credit score, loan amount, and term to see your payments</p>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleCalculate} className="calculator-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Credit Score</label>
            <input
              type="number"
              value={formData.creditScore}
              onChange={(e) => handleInputChange('creditScore', e.target.value)}
              placeholder="e.g., 720"
              min="300"
              max="850"
              required
            />
            <small>Range: 300-850</small>
          </div>

          <div className="form-group">
            <label>Loan Amount ($)</label>
            <input
              type="number"
              value={formData.loanAmount}
              onChange={(e) => handleInputChange('loanAmount', e.target.value)}
              placeholder="e.g., 25000"
              min="1000"
              required
            />
          </div>

          <div className="form-group">
            <label>Loan Term (months)</label>
            <select
              value={formData.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value))}
            >
              <option value={36}>36 months</option>
              <option value={48}>48 months</option>
              <option value={60}>60 months</option>
              <option value={72}>72 months</option>
              <option value={84}>84 months</option>
              <option value={96}>96 months</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Calculate Payments
        </button>
      </form>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {result && (
        <div className="calculator-results">
          <div className="result-header">
            <h4>Your Loan Breakdown</h4>
            <div className="credit-rating">
              Credit Score: {result.creditScore} ({getCreditRating(result.creditScore)})
            </div>
          </div>

          <div className="result-grid">
            <div className="result-card primary">
              <div className="result-label">Monthly Payment</div>
              <div className="result-value">{formatCurrency(result.monthlyPayment)}</div>
            </div>
            
            <div className="result-card">
              <div className="result-label">Interest Rate</div>
              <div className="result-value">{formatPercentage(result.interestRate)}</div>
            </div>
            
            <div className="result-card">
              <div className="result-label">Total Interest</div>
              <div className="result-value">{formatCurrency(result.totalInterest)}</div>
            </div>
            
            <div className="result-card">
              <div className="result-label">Total Payments</div>
              <div className="result-value">{formatCurrency(result.totalPayments)}</div>
            </div>
          </div>

          <div className="result-summary">
            <p>
              You'll pay <strong>{formatCurrency(result.totalInterest)}</strong> in interest over {result.loanTerm} months.
              That's <strong>{formatPercentage(result.totalInterest / result.loanAmount)}</strong> of your loan amount.
            </p>
          </div>
        </div>
      )}

      <div className="calculator-tips">
        <h4>💡 Tips to Improve Your Rate</h4>
        <ul>
          <li>Improve your credit score before applying</li>
          <li>Shop around with multiple lenders</li>
          <li>Consider a larger down payment</li>
          <li>Shorter loan terms typically have better rates</li>
        </ul>
      </div>
    </div>
  )
}

export default SimpleRateCalculator
