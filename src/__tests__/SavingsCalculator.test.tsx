import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SavingsCalculator from '../components/SavingsCalculator'

// Mock the subscription hook
vi.mock('../hooks/useSubscription', () => ({
  useSubscription: () => ({
    subscription: { isActive: true }
  })
}))

describe('SavingsCalculator', () => {
  it('renders calculator inputs', () => {
    render(<SavingsCalculator isPaid={true} />)
    expect(screen.getByText(/vehicle price/i)).toBeInTheDocument()
    expect(screen.getByText(/down payment/i)).toBeInTheDocument()
  })

  it('shows upgrade prompt for free users', () => {
    render(<SavingsCalculator isPaid={false} />)
    expect(screen.getByText(/upgrade/i)).toBeInTheDocument()
  })
})
