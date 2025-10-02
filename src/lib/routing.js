// Hash-based routing for Car Deal Coach
import { useState, useEffect } from 'react'

const ROUTE_TO_PAGE = {
  '#/onboarding': 'onboarding',
  '#/create': 'create',
  '#/saved': 'deals',
  '#/checklist': 'checklist',
  '#/notes': 'notes',
  '#/settings': 'settings',
  '#/upgrade': 'upgrade',
  '#/how-to-use': 'how-to-use',
  '#/legal': 'legal'
}

const PAGE_TO_ROUTE = {
  onboarding: '#/onboarding',
  create: '#/create',
  deals: '#/saved',
  checklist: '#/checklist',
  notes: '#/notes',
  settings: '#/settings',
  upgrade: '#/upgrade',
  'how-to-use': '#/how-to-use',
  legal: '#/legal'
}

export const useHashRoute = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === 'undefined') return 'onboarding'
    const hash = window.location.hash
    return ROUTE_TO_PAGE[hash] || 'onboarding'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleHashChange = () => {
      const hash = window.location.hash
      const page = ROUTE_TO_PAGE[hash] || 'onboarding'
      setCurrentPage(page)
    }

    // Set initial hash if none exists
    if (!window.location.hash) {
      window.location.hash = '#/onboarding'
    }

    // Handle initial load
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (page) => {
    if (typeof window === 'undefined') return
    const route = PAGE_TO_ROUTE[page]
    if (route) {
      window.location.hash = route
    }
  }

  const getCurrentPage = () => currentPage

  return { currentPage, navigateTo, getCurrentPage }
}