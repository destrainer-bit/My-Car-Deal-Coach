// Financing partners API integration

/**
 * Financing partners API integration
 * Note: This is a mock implementation. In production, you'd need actual API keys
 */
export class FinancingAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey || 'your_financing_api_key_here'
    this.baseURL = 'https://api.financing.com'
    this.partners = {
      chase: { name: 'Chase Auto Finance', rate: 0.0349 },
      wellsFargo: { name: 'Wells Fargo Auto', rate: 0.0399 },
      capitalOne: { name: 'Capital One Auto Finance', rate: 0.0329 },
      bankOfAmerica: { name: 'Bank of America Auto Loans', rate: 0.0369 },
      creditUnion: { name: 'Local Credit Union', rate: 0.0299 }
    }
  }

  /**
   * Get financing offers from multiple partners
   * @param {Object} loanRequest - Loan request details
   * @returns {Promise<Array>} - Array of financing offers
   */
  async getFinancingOffers(loanRequest) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const { loanAmount, term, creditScore, downPayment } = loanRequest
      const offers = []
      
      // Generate offers from each partner
      for (const [partnerId, partner] of Object.entries(this.partners)) {
        const offer = this.generateOffer(partnerId, partner, loanRequest)
        if (offer.approved) {
          offers.push(offer)
        }
      }
      
      return {
        timestamp: new Date().toISOString(),
        loanRequest: loanRequest,
        offers: offers.sort((a, b) => a.monthlyPayment - b.monthlyPayment),
        totalOffers: offers.length,
        bestOffer: offers[0] || null
      }
    } catch (error) {
      console.error('Financing API Error:', error)
      throw new Error('Failed to fetch financing offers')
    }
  }

  /**
   * Get pre-qualification status
   * @param {Object} borrowerInfo - Borrower information
   * @returns {Promise<Object>} - Pre-qualification result
   */
  async getPreQualification(borrowerInfo) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const { creditScore, income, debtToIncomeRatio, employmentHistory } = borrowerInfo
      
      // Calculate pre-qualification score
      const score = this.calculatePreQualScore(borrowerInfo)
      const approved = score >= 650
      
      return {
        timestamp: new Date().toISOString(),
        borrowerInfo: borrowerInfo,
        approved: approved,
        score: score,
        maxLoanAmount: approved ? this.calculateMaxLoanAmount(borrowerInfo) : 0,
        recommendedTerm: this.getRecommendedTerm(creditScore),
        nextSteps: this.getNextSteps(approved, score)
      }
    } catch (error) {
      console.error('Pre-qualification Error:', error)
      throw new Error('Failed to process pre-qualification')
    }
  }

  /**
   * Calculate loan payment
   * @param {Object} loanDetails - Loan details
   * @returns {Object} - Payment calculation
   */
  calculateLoanPayment(loanDetails) {
    const { principal, annualRate, termMonths } = loanDetails
    
    if (annualRate === 0) {
      // 0% APR calculation
      return {
        monthlyPayment: principal / termMonths,
        totalInterest: 0,
        totalCost: principal
      }
    }
    
    const monthlyRate = annualRate / 12
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
    
    const totalCost = monthlyPayment * termMonths
    const totalInterest = totalCost - principal
    
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100
    }
  }

  generateOffer(partnerId, partner, loanRequest) {
    const { loanAmount, term, creditScore, downPayment } = loanRequest
    
    // Determine approval based on credit score and loan amount
    const approved = this.isApproved(creditScore, loanAmount, partnerId)
    
    if (!approved) {
      return {
        partnerId: partnerId,
        partnerName: partner.name,
        approved: false,
        reason: this.getRejectionReason(creditScore, loanAmount)
      }
    }
    
    // Calculate rate based on credit score
    const baseRate = partner.rate
    const rateAdjustment = this.getRateAdjustment(creditScore)
    const finalRate = Math.max(baseRate + rateAdjustment, 0.0299) // Minimum 2.99%
    
    // Calculate payment
    const paymentCalc = this.calculateLoanPayment({
      principal: loanAmount,
      annualRate: finalRate,
      termMonths: term
    })
    
    return {
      partnerId: partnerId,
      partnerName: partner.name,
      approved: true,
      interestRate: finalRate,
      term: term,
      monthlyPayment: paymentCalc.monthlyPayment,
      totalInterest: paymentCalc.totalInterest,
      totalCost: paymentCalc.totalCost,
      apr: finalRate,
      features: this.getLoanFeatures(partnerId),
      applicationUrl: this.getApplicationUrl(partnerId),
      phoneNumber: this.getPhoneNumber(partnerId),
      estimatedApprovalTime: this.getApprovalTime(partnerId)
    }
  }

  isApproved(creditScore, loanAmount, partnerId) {
    // Different approval criteria for different partners
    const criteria = {
      chase: { minScore: 620, maxAmount: 100000 },
      wellsFargo: { minScore: 600, maxAmount: 75000 },
      capitalOne: { minScore: 580, maxAmount: 50000 },
      bankOfAmerica: { minScore: 640, maxAmount: 80000 },
      creditUnion: { minScore: 550, maxAmount: 60000 }
    }
    
    const partnerCriteria = criteria[partnerId]
    return creditScore >= partnerCriteria.minScore && loanAmount <= partnerCriteria.maxAmount
  }

  getRateAdjustment(creditScore) {
    if (creditScore >= 750) return -0.005 // -0.5%
    if (creditScore >= 700) return -0.002 // -0.2%
    if (creditScore >= 650) return 0.000  // 0%
    if (creditScore >= 600) return 0.005  // +0.5%
    return 0.015 // +1.5%
  }

  getRejectionReason(creditScore, loanAmount) {
    if (creditScore < 580) return 'Credit score too low'
    if (loanAmount > 100000) return 'Loan amount exceeds maximum'
    return 'Application does not meet criteria'
  }

  getLoanFeatures(partnerId) {
    const features = {
      chase: ['Online application', 'Quick approval', 'Flexible terms'],
      wellsFargo: ['Relationship discounts', 'Auto-pay discount', 'Gap insurance'],
      capitalOne: ['Pre-qualification', 'No impact to credit', 'Competitive rates'],
      bankOfAmerica: ['Preferred customer rates', 'Online account management', 'Mobile app'],
      creditUnion: ['Member benefits', 'Lowest rates', 'Personal service']
    }
    return features[partnerId] || []
  }

  getApplicationUrl(partnerId) {
    const urls = {
      chase: 'https://chase.com/auto-loans',
      wellsFargo: 'https://wellsfargo.com/auto-loans',
      capitalOne: 'https://capitalone.com/auto-loans',
      bankOfAmerica: 'https://bankofamerica.com/auto-loans',
      creditUnion: 'https://localcu.com/auto-loans'
    }
    return urls[partnerId] || '#'
  }

  getPhoneNumber(partnerId) {
    const phones = {
      chase: '1-800-242-7324',
      wellsFargo: '1-800-289-8004',
      capitalOne: '1-800-946-0332',
      bankOfAmerica: '1-800-215-6195',
      creditUnion: '1-800-555-0123'
    }
    return phones[partnerId] || '1-800-555-0123'
  }

  getApprovalTime(partnerId) {
    const times = {
      chase: '24-48 hours',
      wellsFargo: '1-2 business days',
      capitalOne: 'Same day',
      bankOfAmerica: '24-72 hours',
      creditUnion: '1-3 business days'
    }
    return times[partnerId] || '1-2 business days'
  }

  calculatePreQualScore(borrowerInfo) {
    const { creditScore, income, debtToIncomeRatio, employmentHistory } = borrowerInfo
    
    let score = creditScore * 0.6 // 60% weight on credit score
    
    // Income factor (20% weight)
    if (income >= 75000) score += 50
    else if (income >= 50000) score += 30
    else if (income >= 30000) score += 10
    
    // Debt-to-income ratio (15% weight)
    if (debtToIncomeRatio <= 0.3) score += 30
    else if (debtToIncomeRatio <= 0.4) score += 20
    else if (debtToIncomeRatio <= 0.5) score += 10
    
    // Employment history (5% weight)
    if (employmentHistory >= 2) score += 20
    else if (employmentHistory >= 1) score += 10
    
    return Math.min(Math.round(score), 850)
  }

  calculateMaxLoanAmount(borrowerInfo) {
    const { income, debtToIncomeRatio } = borrowerInfo
    const availableIncome = income * (0.4 - debtToIncomeRatio) // 40% max DTI
    const maxAnnualPayment = availableIncome * 12
    const maxLoanAmount = maxAnnualPayment * 5 // 5-year max term assumption
    return Math.max(Math.round(maxLoanAmount), 5000)
  }

  getRecommendedTerm(creditScore) {
    if (creditScore >= 750) return 60 // 5 years
    if (creditScore >= 650) return 48 // 4 years
    return 36 // 3 years
  }

  getNextSteps(approved, score) {
    if (approved) {
      return [
        'Gather required documents (pay stubs, bank statements)',
        'Complete full application with chosen lender',
        'Schedule vehicle inspection if required',
        'Review and sign loan documents'
      ]
    } else {
      return [
        'Improve credit score by paying down debt',
        'Increase income or reduce expenses',
        'Consider a co-signer',
        'Look for lenders with more flexible criteria'
      ]
    }
  }
}

// Export singleton instance
export const financingAPI = new FinancingAPI()
