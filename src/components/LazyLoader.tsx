import React, { Suspense, lazy } from 'react'

// Lazy load heavy components
const SavingsCalculator = lazy(() => import('./SavingsCalculator'))
const CreateDeal = lazy(() => import('../pages/CreateDeal'))
const SavedDeals = lazy(() => import('../pages/SavedDeals'))

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    Loading...
  </div>
)

// Lazy wrapper component
export function LazySavingsCalculator(props: any) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SavingsCalculator {...props} />
    </Suspense>
  )
}

export function LazyCreateDeal(props: any) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateDeal {...props} />
    </Suspense>
  )
}

export function LazySavedDeals(props: any) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SavedDeals {...props} />
    </Suspense>
  )
}
