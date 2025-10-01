import React, { useState } from 'react'

function FinancingCalculator({ vehiclePrice, onClose }) {
  const [loanAmount, setLoanAmount] = useState(vehiclePrice || 25000)
  const [downPayment, setDownPayment] = useState(5000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(60) // months
  const [tradeInValue, setTradeInValue] = useState(0)
  const [taxes, setTaxes] = useState(8.5) // percentage
  const [fees, setFees] = useState(500)

  const calculatePayment = () => {
    const principal = loanAmount - downPayment - tradeInValue
    const taxAmount = (loanAmount * taxes) / 100
    const totalLoan = principal + taxAmount + fees
    const monthlyRate = interestRate / 100 / 12
    const numPayments = loanTerm

    if (monthlyRate === 0) {
      return totalLoan / numPayments
    }

    const monthlyPayment = totalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    return monthlyPayment
  }

  const monthlyPayment = calculatePayment()
  const totalCost = monthlyPayment * loanTerm
  const totalInterest = totalCost - (loanAmount - downPayment - tradeInValue)

  return (
    <div className="financing-calculator">
      <div className="calculator-header">
        <h3>💰 Financing Calculator</h3>
        <button className="close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="calculator-grid">
        <div className="input-group">
          <label>Vehicle Price</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            placeholder="25000"
          />
        </div>

        <div className="input-group">
          <label>Down Payment</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            placeholder="5000"
          />
        </div>

        <div className="input-group">
          <label>Trade-in Value</label>
          <input
            type="number"
            value={tradeInValue}
            onChange={(e) => setTradeInValue(Number(e.target.value))}
            placeholder="0"
          />
        </div>

        <div className="input-group">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            placeholder="6.5"
          />
        </div>

        <div className="input-group">
          <label>Loan Term (months)</label>
          <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))}>
            <option value={36}>36 months</option>
            <option value={48}>48 months</option>
            <option value={60}>60 months</option>
            <option value={72}>72 months</option>
            <option value={84}>84 months</option>
          </select>
        </div>

        <div className="input-group">
          <label>Tax Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={taxes}
            onChange={(e) => setTaxes(Number(e.target.value))}
            placeholder="8.5"
          />
        </div>
      </div>

      <div className="calculator-results">
        <div className="result-card primary">
          <div className="result-label">Monthly Payment</div>
          <div className="result-value">${monthlyPayment.toFixed(2)}</div>
        </div>
        
        <div className="result-card">
          <div className="result-label">Total Interest</div>
          <div className="result-value">${totalInterest.toFixed(2)}</div>
        </div>
        
        <div className="result-card">
          <div className="result-label">Total Cost</div>
          <div className="result-value">${totalCost.toFixed(2)}</div>
        </div>
      </div>

      <div className="calculator-tips">
        <h4>💡 Financing Tips</h4>
        <ul>
          <li>Shop around for the best interest rates</li>
          <li>Consider a larger down payment to reduce monthly payments</li>
          <li>Shorter loan terms save money on interest</li>
          <li>Get pre-approved before visiting dealerships</li>
        </ul>
      </div>
    </div>
  )
}

export default FinancingCalculator
