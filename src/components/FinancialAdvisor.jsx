import React, { useState } from 'react'

function FinancialAdvisor({ onClose }) {
  const [formData, setFormData] = useState({
    creditScore: '',
    annualIncome: '',
    monthlyDebtPayments: '',
    employmentStatus: 'employed',
    employmentLength: '',
    downPaymentAmount: '',
    vehiclePrice: '',
    loanTerm: 60,
    currentDebts: '',
    creditHistory: 'good'
  })

  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateDTI = (monthlyIncome, monthlyDebts) => {
    if (!monthlyIncome || !monthlyDebts) return null
    return (monthlyDebts / monthlyIncome) * 100
  }

  const getCreditTier = (score) => {
    if (score >= 800) return { tier: 'Excellent', rate: 4.5, color: '#10b981' }
    if (score >= 740) return { tier: 'Very Good', rate: 5.5, color: '#3b82f6' }
    if (score >= 680) return { tier: 'Good', rate: 6.5, color: '#f59e0b' }
    if (score >= 620) return { tier: 'Fair', rate: 8.5, color: '#f97316' }
    if (score >= 580) return { tier: 'Poor', rate: 10.5, color: '#ef4444' }
    return { tier: 'Very Poor', rate: 12.5, color: '#dc2626' }
  }

  const getDTIAssessment = (dti) => {
    if (dti <= 20) return { level: 'Excellent', color: '#10b981', message: 'Low debt-to-income ratio. You\'re in great shape for financing.' }
    if (dti <= 30) return { level: 'Good', color: '#3b82f6', message: 'Moderate debt-to-income ratio. You should qualify for good rates.' }
    if (dti <= 40) return { level: 'Fair', color: '#f59e0b', message: 'Higher debt-to-income ratio. Consider reducing debt before applying.' }
    if (dti <= 50) return { level: 'Poor', color: '#f97316', message: 'High debt-to-income ratio. You may face higher rates or need a co-signer.' }
    return { level: 'Very Poor', color: '#ef4444', message: 'Very high debt-to-income ratio. Focus on debt reduction first.' }
  }

  const generateRecommendations = (data) => {
    const recommendations = []
    const creditTier = getCreditTier(data.creditScore)
    const dti = calculateDTI(data.annualIncome / 12, data.monthlyDebtPayments)
    const dtiAssessment = dti ? getDTIAssessment(dti) : null

    // Credit score recommendations
    if (data.creditScore < 680) {
      recommendations.push({
        category: 'Credit Improvement',
        priority: 'High',
        title: 'Improve Your Credit Score',
        description: `Your score of ${data.creditScore} puts you in the ${creditTier.tier} tier. Focus on:`,
        actions: [
          'Pay all bills on time (most important factor)',
          'Keep credit card balances below 30% of limits',
          'Don\'t open new credit accounts before applying',
          'Check your credit report for errors',
          'Consider a secured credit card if needed'
        ]
      })
    }

    // DTI recommendations
    if (dti && dti > 30) {
      recommendations.push({
        category: 'Debt Management',
        priority: dti > 40 ? 'High' : 'Medium',
        title: 'Reduce Your Debt-to-Income Ratio',
        description: `Your DTI is ${dti.toFixed(1)}%. ${dtiAssessment.message}`,
        actions: [
          'Pay down high-interest debt first',
          'Consider debt consolidation',
          'Increase your down payment amount',
          'Look for ways to increase your income',
          'Consider a longer loan term to reduce monthly payments'
        ]
      })
    }

    // Employment recommendations
    if (data.employmentStatus === 'self-employed' || data.employmentLength < 2) {
      recommendations.push({
        category: 'Employment',
        priority: 'Medium',
        title: 'Strengthen Your Employment Profile',
        description: 'Lenders prefer stable employment history.',
        actions: [
          'Gather 2+ years of tax returns if self-employed',
          'Get a co-signer with stable employment',
          'Consider waiting if you recently changed jobs',
          'Prepare documentation of income sources'
        ]
      })
    }

    // Down payment recommendations
    const downPaymentPercent = (data.downPaymentAmount / data.vehiclePrice) * 100
    if (downPaymentPercent < 10) {
      recommendations.push({
        category: 'Down Payment',
        priority: 'Medium',
        title: 'Consider a Larger Down Payment',
        description: `Your ${downPaymentPercent.toFixed(1)}% down payment is below the recommended 20%.`,
        actions: [
          'Save for a larger down payment to get better rates',
          'Consider a less expensive vehicle',
          'Look for down payment assistance programs',
          'Trade in your current vehicle for additional equity'
        ]
      })
    }

    // Rate optimization
    recommendations.push({
      category: 'Rate Optimization',
      priority: 'High',
      title: 'Get the Best Interest Rate',
      description: `With your ${creditTier.tier} credit, you should qualify for rates around ${creditTier.rate}% APR.`,
      actions: [
        'Shop around with multiple lenders (banks, credit unions, online lenders)',
        'Get pre-approved before visiting dealerships',
        'Compare rates from at least 3 different sources',
        'Consider a credit union for potentially better rates',
        'Ask about rate discounts for automatic payments'
      ]
    })

    return recommendations
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const data = {
        creditScore: parseInt(formData.creditScore),
        annualIncome: parseFloat(formData.annualIncome),
        monthlyDebtPayments: parseFloat(formData.monthlyDebtPayments),
        employmentStatus: formData.employmentStatus,
        employmentLength: parseInt(formData.employmentLength),
        downPaymentAmount: parseFloat(formData.downPaymentAmount),
        vehiclePrice: parseFloat(formData.vehiclePrice),
        loanTerm: parseInt(formData.loanTerm),
        currentDebts: formData.currentDebts,
        creditHistory: formData.creditHistory
      }

      const creditTier = getCreditTier(data.creditScore)
      const dti = calculateDTI(data.annualIncome / 12, data.monthlyDebtPayments)
      const dtiAssessment = dti ? getDTIAssessment(dti) : null
      const recommendations = generateRecommendations(data)

      setAnalysis({
        creditTier,
        dti,
        dtiAssessment,
        recommendations,
        data
      })
    } catch (error) {
      console.error('Analysis error:', error)
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

  return (
    <div className="financial-advisor">
      <div className="advisor-header">
        <h3>💰 Financial Advisor</h3>
        <p>Get personalized financing guidance based on your financial profile</p>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleAnalyze} className="advisor-form">
        <div className="form-section">
          <h4>Credit & Income Profile</h4>
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
            </div>

            <div className="form-group">
              <label>Annual Income ($)</label>
              <input
                type="number"
                value={formData.annualIncome}
                onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                placeholder="e.g., 75000"
                required
              />
            </div>

            <div className="form-group">
              <label>Monthly Debt Payments ($)</label>
              <input
                type="number"
                value={formData.monthlyDebtPayments}
                onChange={(e) => handleInputChange('monthlyDebtPayments', e.target.value)}
                placeholder="e.g., 1200"
                required
              />
            </div>

            <div className="form-group">
              <label>Employment Status</label>
              <select
                value={formData.employmentStatus}
                onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
              >
                <option value="employed">Employed (W-2)</option>
                <option value="self-employed">Self-Employed</option>
                <option value="contractor">Contractor</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            <div className="form-group">
              <label>Employment Length (years)</label>
              <input
                type="number"
                value={formData.employmentLength}
                onChange={(e) => handleInputChange('employmentLength', e.target.value)}
                placeholder="e.g., 3"
                min="0"
                max="50"
              />
            </div>

            <div className="form-group">
              <label>Credit History</label>
              <select
                value={formData.creditHistory}
                onChange={(e) => handleInputChange('creditHistory', e.target.value)}
              >
                <option value="excellent">Excellent (no late payments)</option>
                <option value="good">Good (1-2 minor issues)</option>
                <option value="fair">Fair (some late payments)</option>
                <option value="poor">Poor (multiple issues)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Vehicle & Financing Details</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Vehicle Price ($)</label>
              <input
                type="number"
                value={formData.vehiclePrice}
                onChange={(e) => handleInputChange('vehiclePrice', e.target.value)}
                placeholder="e.g., 30000"
                required
              />
            </div>

            <div className="form-group">
              <label>Down Payment ($)</label>
              <input
                type="number"
                value={formData.downPaymentAmount}
                onChange={(e) => handleInputChange('downPaymentAmount', e.target.value)}
                placeholder="e.g., 5000"
                required
              />
            </div>

            <div className="form-group">
              <label>Preferred Loan Term</label>
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
              <label>Current Debts (optional)</label>
              <textarea
                value={formData.currentDebts}
                onChange={(e) => handleInputChange('currentDebts', e.target.value)}
                placeholder="e.g., Credit cards: $3,000, Student loan: $15,000"
                rows="3"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Analyzing...' : 'Get Financial Analysis'}
        </button>
      </form>

      {analysis && (
        <div className="analysis-results">
          <div className="analysis-header">
            <h4>Your Financial Analysis</h4>
          </div>

          <div className="analysis-summary">
            <div className="summary-card">
              <div className="summary-label">Credit Tier</div>
              <div className="summary-value" style={{ color: analysis.creditTier.color }}>
                {analysis.creditTier.tier} ({analysis.creditTier.rate}% APR)
              </div>
            </div>

            {analysis.dti && (
              <div className="summary-card">
                <div className="summary-label">Debt-to-Income Ratio</div>
                <div className="summary-value" style={{ color: analysis.dtiAssessment.color }}>
                  {analysis.dti.toFixed(1)}% ({analysis.dtiAssessment.level})
                </div>
              </div>
            )}

            <div className="summary-card">
              <div className="summary-label">Loan Amount</div>
              <div className="summary-value">
                {formatCurrency(analysis.data.vehiclePrice - analysis.data.downPaymentAmount)}
              </div>
            </div>
          </div>

          <div className="recommendations">
            <h4>Personalized Recommendations</h4>
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="recommendation-header">
                  <h5>{rec.title}</h5>
                  <span className={`priority-badge priority-${rec.priority.toLowerCase()}`}>
                    {rec.priority} Priority
                  </span>
                </div>
                <p className="recommendation-description">{rec.description}</p>
                <ul className="recommendation-actions">
                  {rec.actions.map((action, actionIndex) => (
                    <li key={actionIndex}>{action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="next-steps">
            <h4>Next Steps</h4>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h5>Improve Your Profile</h5>
                  <p>Follow the recommendations above to strengthen your financial position</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h5>Shop Around</h5>
                  <p>Get pre-approved with multiple lenders to compare rates</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h5>Negotiate</h5>
                  <p>Use your pre-approval to negotiate better terms at the dealership</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinancialAdvisor
