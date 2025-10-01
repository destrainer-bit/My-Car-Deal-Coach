import React, { useState } from 'react'

function PaymentCalculator({ onClose }) {
  const [formData, setFormData] = useState({
    vehiclePrice: '',
    downPayment: '',
    tradeInValue: '',
    taxesAndFees: '',
    monthlyPayment: '',
    loanTerm: 60,
    totalPayments: ''
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

  const calculateRate = (principal, monthlyPayment, months) => {
    if (monthlyPayment <= 0 || principal <= 0 || months <= 0) {
      return null
    }

    // Use binary search to find the APR
    let low = 0.001 // 0.1%
    let high = 0.5   // 50%
    let tolerance = 0.0001 // 0.01%
    let maxIterations = 100
    let iterations = 0

    while (iterations < maxIterations && (high - low) > tolerance) {
      const mid = (low + high) / 2
      const calculatedPayment = calculateMonthlyPayment(principal, mid, months)
      
      if (Math.abs(calculatedPayment - monthlyPayment) < 0.01) {
        return mid
      } else if (calculatedPayment < monthlyPayment) {
        low = mid
      } else {
        high = mid
      }
      iterations++
    }

    return (low + high) / 2
  }

  const calculateMonthlyPayment = (principal, annualRate, months) => {
    if (annualRate === 0) return principal / months
    
    const monthlyRate = annualRate / 12
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  const calculateTotalInterest = (monthlyPayment, months, principal) => {
    return (monthlyPayment * months) - principal
  }

  const getRateAssessment = (rate) => {
    if (rate < 0.04) return { level: 'Excellent', color: '#00C851', message: 'This is an excellent rate!' }
    if (rate < 0.06) return { level: 'Good', color: '#33B5E5', message: 'This is a good rate.' }
    if (rate < 0.08) return { level: 'Fair', color: '#FFBB33', message: 'This is a fair rate.' }
    if (rate < 0.12) return { level: 'Poor', color: '#FF8800', message: 'This rate is on the high side.' }
    return { level: 'Very Poor', color: '#FF4444', message: 'This rate is very high - shop around!' }
  }

  const handleCalculate = (e) => {
    e.preventDefault()
    setError(null)

    try {
      const vehiclePrice = parseFloat(formData.vehiclePrice) || 0
      const downPayment = parseFloat(formData.downPayment) || 0
      const tradeInValue = parseFloat(formData.tradeInValue) || 0
      const taxesAndFees = parseFloat(formData.taxesAndFees) || 0
      const monthlyPayment = parseFloat(formData.monthlyPayment) || 0
      const loanTerm = parseInt(formData.loanTerm) || 60

      if (!vehiclePrice || !monthlyPayment || !loanTerm) {
        throw new Error('Please fill in Vehicle Price, Monthly Payment, and Loan Term')
      }

      if (loanTerm < 12 || loanTerm > 120) {
        throw new Error('Loan term must be between 12 and 120 months')
      }

      // Calculate loan amount
      const loanAmount = vehiclePrice - downPayment - tradeInValue + taxesAndFees

      if (loanAmount <= 0) {
        throw new Error('Loan amount must be greater than 0. Check your down payment and trade-in values.')
      }

      // Calculate the interest rate
      const annualRate = calculateRate(loanAmount, monthlyPayment, loanTerm)

      if (annualRate === null) {
        throw new Error('Unable to calculate rate. Please check your inputs.')
      }

      // Calculate total payments
      const totalPayments = monthlyPayment * loanTerm
      const totalInterest = calculateTotalInterest(monthlyPayment, loanTerm, loanAmount)

      // Get rate assessment
      const assessment = getRateAssessment(annualRate)

      setResult({
        loanAmount,
        annualRate,
        monthlyPayment,
        totalPayments,
        totalInterest,
        loanTerm,
        assessment,
        inputs: {
          vehiclePrice,
          downPayment,
          tradeInValue,
          taxesAndFees
        }
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

  return (
    <div className="payment-calculator">
      <div className="calculator-header">
        <h2 style={{ color: '#ffffff' }}>🧮 Payment Calculator</h2>
        <p style={{ color: '#ffffff' }}>Enter your dealer's worksheet to calculate your actual interest rate</p>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleCalculate} className="calculator-form">
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
            <label style={{ color: '#ffffff' }}>Trade-in Value ($)</label>
            <input
              type="number"
              value={formData.tradeInValue}
              onChange={(e) => handleInputChange('tradeInValue', e.target.value)}
              placeholder="e.g., 3000"
            />
          </div>

          <div className="form-group">
            <label style={{ color: '#ffffff' }}>Taxes & Fees ($)</label>
            <input
              type="number"
              value={formData.taxesAndFees}
              onChange={(e) => handleInputChange('taxesAndFees', e.target.value)}
              placeholder="e.g., 1200"
            />
          </div>

          <div className="form-group">
            <label style={{ color: '#ffffff' }}>Monthly Payment ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.monthlyPayment}
              onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
              placeholder="e.g., 425.50"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ color: '#ffffff' }}>Loan Term (months)</label>
            <input
              type="number"
              value={formData.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value) || 0)}
              placeholder="e.g., 66, 75, 84, 96"
              min="12"
              max="120"
              required
            />
            <small style={{ color: '#888', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
              Common terms: 36, 48, 60, 66, 72, 75, 84, 96 months
            </small>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Calculate Interest Rate
        </button>
      </form>

      {error && (
        <div className="error-message">
          <p style={{ color: '#ff4444' }}>❌ {error}</p>
        </div>
      )}

      {result && (
        <div className="calculator-results">
          <h3 style={{ color: '#ffffff' }}>📊 Your Rate Analysis</h3>
          
          <div className="rate-assessment" style={{ backgroundColor: result.assessment.color + '20', border: `2px solid ${result.assessment.color}`, borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <h4 style={{ color: result.assessment.color, margin: '0 0 10px 0' }}>
              {result.assessment.level} Rate: {formatPercentage(result.annualRate)}
            </h4>
            <p style={{ color: '#ffffff', margin: 0 }}>{result.assessment.message}</p>
          </div>

          <div className="results-grid">
            <div className="result-card">
              <h4 style={{ color: '#0B84FE' }}>Interest Rate</h4>
              <p className="result-value" style={{ color: '#ffffff' }}>
                {formatPercentage(result.annualRate)}
              </p>
            </div>

            <div className="result-card">
              <h4 style={{ color: '#0B84FE' }}>Loan Amount</h4>
              <p className="result-value" style={{ color: '#ffffff' }}>
                {formatCurrency(result.loanAmount)}
              </p>
            </div>

            <div className="result-card">
              <h4 style={{ color: '#0B84FE' }}>Monthly Payment</h4>
              <p className="result-value" style={{ color: '#ffffff' }}>
                {formatCurrency(result.monthlyPayment)}
              </p>
            </div>

            <div className="result-card">
              <h4 style={{ color: '#0B84FE' }}>Total Payments</h4>
              <p className="result-value" style={{ color: '#ffffff' }}>
                {formatCurrency(result.totalPayments)}
              </p>
            </div>

            <div className="result-card">
              <h4 style={{ color: '#0B84FE' }}>Total Interest</h4>
              <p className="result-value" style={{ color: '#ffffff' }}>
                {formatCurrency(result.totalInterest)}
              </p>
            </div>

            <div className="result-card">
              <h4 style={{ color: '#0B84FE' }}>Loan Term</h4>
              <p className="result-value" style={{ color: '#ffffff' }}>
                {result.loanTerm} months
              </p>
            </div>
          </div>

          <div className="input-breakdown">
            <h4 style={{ color: '#ffffff' }}>💰 Loan Breakdown</h4>
            <div className="breakdown-list">
              <div className="breakdown-item">
                <span style={{ color: '#ffffff' }}>Vehicle Price:</span>
                <span style={{ color: '#ffffff' }}>{formatCurrency(result.inputs.vehiclePrice)}</span>
              </div>
              <div className="breakdown-item">
                <span style={{ color: '#ffffff' }}>Down Payment:</span>
                <span style={{ color: '#ffffff' }}>-{formatCurrency(result.inputs.downPayment)}</span>
              </div>
              <div className="breakdown-item">
                <span style={{ color: '#ffffff' }}>Trade-in Value:</span>
                <span style={{ color: '#ffffff' }}>-{formatCurrency(result.inputs.tradeInValue)}</span>
              </div>
              <div className="breakdown-item">
                <span style={{ color: '#ffffff' }}>Taxes & Fees:</span>
                <span style={{ color: '#ffffff' }}>+{formatCurrency(result.inputs.taxesAndFees)}</span>
              </div>
              <div className="breakdown-item total">
                <span style={{ color: '#0B84FE', fontWeight: 'bold' }}>Loan Amount:</span>
                <span style={{ color: '#0B84FE', fontWeight: 'bold' }}>{formatCurrency(result.loanAmount)}</span>
              </div>
            </div>
          </div>

          <div className="rate-tips">
            <h4 style={{ color: '#ffffff' }}>💡 Rate Tips</h4>
            <ul className="tips-list">
              {result.annualRate > 0.08 && (
                <li style={{ color: '#ffffff' }}>Your rate is above 8% - consider shopping around for better rates</li>
              )}
              {result.annualRate > 0.12 && (
                <li style={{ color: '#ffffff' }}>Rates above 12% are considered high - look into credit improvement or alternative lenders</li>
              )}
              {result.loanTerm > 60 && (
                <li style={{ color: '#ffffff' }}>Longer loan terms (60+ months) often have higher rates and cost more in total interest</li>
              )}
              {result.loanTerm > 84 && (
                <li style={{ color: '#ffffff' }}>Very long terms (84+ months) can result in negative equity - you may owe more than the car is worth</li>
              )}
              {result.totalInterest > result.loanAmount * 0.3 && (
                <li style={{ color: '#ffffff' }}>You'll pay more than 30% of the loan amount in interest - consider a larger down payment</li>
              )}
              <li style={{ color: '#ffffff' }}>Compare this rate with our Finance Calculator to see if you can get better terms</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentCalculator
