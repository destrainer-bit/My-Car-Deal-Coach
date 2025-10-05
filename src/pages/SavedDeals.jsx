import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DealCard from '../components/DealCard.jsx'
import RangeBadge from '../components/RangeBadge.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import FinancingCalculator from '../components/FinancingCalculator.jsx'
import DealComparison from '../components/DealComparison.jsx'
import AnalyticsDashboard from '../components/AnalyticsDashboard.jsx'
import SimpleMarketDataModal from '../components/SimpleMarketDataModal.jsx'
import SimpleFinancingOffers from '../components/SimpleFinancingOffers.jsx'
import { usePullToRefresh, triggerHaptic } from '../lib/gestures.js'

function SavedDeals({ deals, setDeals, navigateTo, onUpdateDeal, onAddPhoto, onAddNote, onUpdateChecklistProgress, checklistProgress }) {
  console.log('SavedDeals component rendering with deals:', deals)
  console.log('SavedDeals props:', { deals, setDeals, navigateTo, onUpdateDeal, onAddPhoto, onAddNote, onUpdateChecklistProgress, checklistProgress })
  
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('updated')
  const [deleteModal, setDeleteModal] = useState(null)

  // Pull-to-refresh functionality
  const { 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd, 
    isRefreshing, 
    pullProgress 
  } = usePullToRefresh(() => {
    triggerHaptic('success')
    // Simulate refresh - in a real app, this would reload data
    console.log('Refreshing deals...')
  })
  const [showCalculator, setShowCalculator] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showMarketData, setShowMarketData] = useState(false)
  const [showFinancingOffers, setShowFinancingOffers] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [advancedFilters, setAdvancedFilters] = useState({
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    mileageMax: '',
    condition: 'all'
  })
  const [selectedDeals, setSelectedDeals] = useState([])
  const [bulkAction, setBulkAction] = useState('')

  // Handler functions
  const onEdit = (dealId, updates = {}) => {
    const updatedDeals = deals.map(deal => 
      deal.id === dealId ? { ...deal, ...updates, updatedAt: new Date().toISOString() } : deal
    )
    setDeals(updatedDeals)
    if (onUpdateDeal) onUpdateDeal(dealId, updates)
  }

  const onDelete = (dealId) => {
    const updatedDeals = deals.filter(deal => deal.id !== dealId)
    setDeals(updatedDeals)
  }

  const onDuplicate = (dealId) => {
    const originalDeal = deals.find(deal => deal.id === dealId)
    if (originalDeal) {
      const duplicatedDeal = {
        ...originalDeal,
        id: `duplicate-${Date.now()}`,
        status: 'researching',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const updatedDeals = [...deals, duplicatedDeal]
      setDeals(updatedDeals)
    }
  }

  const onCreateNew = () => {
    navigate('/app/create-deal')
  }

  const statusOptions = [
    { value: 'all', label: 'All Deals' },
    { value: 'researching', label: 'Researching' },
    { value: 'visiting', label: 'Visiting' },
    { value: 'pending_finance', label: 'Pending Finance' },
    { value: 'walked_away', label: 'Walked Away' },
    { value: 'purchased', label: 'Purchased' }
  ]

  const sortOptions = [
    { value: 'updated', label: 'Recently Updated' },
    { value: 'created', label: 'Recently Created' },
    { value: 'make', label: 'Make/Model' },
    { value: 'price', label: 'Price Range' }
  ]

  const filteredDeals = deals.filter(deal => {
    // Status filter
    if (filterStatus !== 'all' && deal.status !== filterStatus) return false
    
    // Advanced filters
    const price = deal.price?.estimated?.mid || deal.price?.asking || 0
    const year = parseInt(deal.vehicle?.year || 0)
    const mileage = parseInt(deal.vehicle?.mileage || 0)
    const condition = deal.vehicle?.condition || 'unknown'
    
    if (advancedFilters.priceMin && price < parseInt(advancedFilters.priceMin)) return false
    if (advancedFilters.priceMax && price > parseInt(advancedFilters.priceMax)) return false
    if (advancedFilters.yearMin && year < parseInt(advancedFilters.yearMin)) return false
    if (advancedFilters.yearMax && year > parseInt(advancedFilters.yearMax)) return false
    if (advancedFilters.mileageMax && mileage > parseInt(advancedFilters.mileageMax)) return false
    if (advancedFilters.condition !== 'all' && condition !== parseInt(advancedFilters.condition)) return false
    
    return true
  })

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'updated':
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'make':
        return (a.vehicle?.make || '').localeCompare(b.vehicle?.make || '') || 
               (a.vehicle?.model || '').localeCompare(b.vehicle?.model || '')
      case 'price':
        return (b.price?.estimated?.mid || b.price?.asking || 0) - (a.price?.estimated?.mid || a.price?.asking || 0)
      default:
        return 0
    }
  })

  const handleDelete = (dealId) => {
    setDeleteModal({
      title: 'Delete Deal',
      message: 'Are you sure you want to delete this deal? This action cannot be undone.',
      onConfirm: () => {
        onDelete(dealId)
        setDeleteModal(null)
      },
      onCancel: () => setDeleteModal(null)
    })
  }

  const getStatusCounts = () => {
    const counts = {}
    statusOptions.forEach(status => {
      if (status.value === 'all') {
        counts[status.value] = deals.length
      } else {
        counts[status.value] = deals.filter(deal => deal.status === status.value).length
      }
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  const toggleDealSelection = (dealId) => {
    if (selectedDeals.includes(dealId)) {
      setSelectedDeals(selectedDeals.filter(id => id !== dealId))
    } else {
      setSelectedDeals([...selectedDeals, dealId])
    }
  }

  const selectAllDeals = () => {
    setSelectedDeals(sortedDeals.map(deal => deal.id))
  }

  const clearSelection = () => {
    setSelectedDeals([])
  }

  const handleBulkAction = () => {
    if (!bulkAction || selectedDeals.length === 0) return

    const selectedDealObjects = sortedDeals.filter(deal => selectedDeals.includes(deal.id))
    
    switch (bulkAction) {
      case 'delete':
        setDeleteModal({
          title: 'Delete Multiple Deals',
          message: `Are you sure you want to delete ${selectedDeals.length} deals? This action cannot be undone.`,
          onConfirm: () => {
            selectedDeals.forEach(dealId => onDelete(dealId))
            setSelectedDeals([])
            setBulkAction('')
            setDeleteModal(null)
          },
          onCancel: () => setDeleteModal(null)
        })
        break
      case 'status':
        // Update status for all selected deals
        selectedDealObjects.forEach(deal => {
          onEdit(deal.id, { ...deal, status: 'researching' })
        })
        setSelectedDeals([])
        setBulkAction('')
        break
      case 'duplicate':
        // Duplicate all selected deals
        selectedDealObjects.forEach(deal => {
          onDuplicate(deal.id)
        })
        setSelectedDeals([])
        setBulkAction('')
        break
    }
  }

  // Add error boundary
  if (!deals) {
    console.error('SavedDeals: deals prop is undefined')
    return <div className="error">No deals data available</div>
  }

  console.log('About to render SavedDeals with deals.length:', deals.length)

  return (
    <div 
      className="mobile-first-saved-deals"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mobile-first-saved-deals-container">
      {/* Pull-to-refresh indicator */}
      {isRefreshing && (
        <div className="pull-to-refresh-indicator">
          <div className="refresh-spinner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-spin">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 12 12;360 12 12"/>
              </path>
            </svg>
          </div>
          <span>Refreshing...</span>
        </div>
      )}

      <div className="mobile-first-saved-deals-header">
        <h1 className="mobile-first-title">Your Deals</h1>
        <div className="mobile-first-header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowCalculator(true)}
            title="Financing Calculator"
          >
            Calculator
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowComparison(true)}
            title="Compare Deals"
          >
            🔍 Compare
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowAnalytics(true)}
            title="Analytics Dashboard"
          >
            Analytics
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setSelectedDeal(null)
              setShowMarketData(true)
            }}
            title="Market Data & Valuations"
          >
            📈 Market Data
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setSelectedDeal(null)
              setShowFinancingOffers(true)
            }}
            title="Financing Offers"
          >
            🏦 Financing
          </button>
          <button className="btn btn-primary" onClick={onCreateNew}>
            + New Deal
          </button>
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="var(--color-primary)" opacity="0.1"/>
              <circle cx="32" cy="32" r="20" fill="none" stroke="var(--color-primary)" strokeWidth="3"/>
              <circle cx="32" cy="32" r="16" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.6"/>
              <circle cx="32" cy="32" r="6" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.3"/>
              <circle cx="32" cy="32" r="3" fill="var(--color-primary)"/>
            </svg>
          </div>
          <h2>No deals yet</h2>
          <p>Start by creating your first deal to track a vehicle you're interested in.</p>
          <button className="btn btn-primary" onClick={onCreateNew}>
            Create Your First Deal
          </button>
        </div>
      ) : (
        <>
          <div className="deals-filters">
            <div className="filter-group">
              <label>Filter by Status</label>
              <div className="filter-buttons">
                {statusOptions.map(status => (
                  <button
                    key={status.value}
                    className={`filter-btn ${filterStatus === status.value ? 'active' : ''}`}
                    onClick={() => setFilterStatus(status.value)}
                  >
                    {status.label}
                    <span className="count">({statusCounts[status.value]})</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-group">
              <label>Sort by</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="advanced-filters">
            <h4>🔍 Advanced Filters</h4>
            <div className="filter-grid">
              <div className="filter-group">
                <label>Price Range:</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={advancedFilters.priceMin}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, priceMin: e.target.value})}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={advancedFilters.priceMax}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, priceMax: e.target.value})}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Year Range:</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={advancedFilters.yearMin}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, yearMin: e.target.value})}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={advancedFilters.yearMax}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, yearMax: e.target.value})}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Max Mileage:</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={advancedFilters.mileageMax}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, mileageMax: e.target.value})}
                />
              </div>

              <div className="filter-group">
                <label>Min Condition:</label>
                <select 
                  value={advancedFilters.condition} 
                  onChange={(e) => setAdvancedFilters({...advancedFilters, condition: e.target.value})}
                >
                  <option value="all">Any Condition</option>
                  <option value="5">Excellent (5/5)</option>
                  <option value="4">Very Good (4/5)</option>
                  <option value="3">Good (3/5)</option>
                  <option value="2">Fair (2/5)</option>
                </select>
              </div>
            </div>
          </div>

          {selectedDeals.length > 0 && (
            <div className="bulk-operations">
              <div className="bulk-header">
                <h4>📦 Bulk Operations</h4>
                <div className="bulk-info">
                  {selectedDeals.length} deal{selectedDeals.length !== 1 ? 's' : ''} selected
                </div>
              </div>
              
              <div className="bulk-actions">
                <div className="bulk-controls">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={selectAllDeals}
                  >
                    Select All
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={clearSelection}
                  >
                    Clear Selection
                  </button>
                </div>
                
                <div className="bulk-actions-right">
                  <select 
                    value={bulkAction} 
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="bulk-select"
                  >
                    <option value="">Choose Action...</option>
                    <option value="status">Change Status to Researching</option>
                    <option value="duplicate">Duplicate Selected</option>
                    <option value="delete">Delete Selected</option>
                  </select>
                  
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                  >
                    Apply Action
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="deals-grid">
            {sortedDeals.map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                onEdit={onEdit}
                onDelete={() => handleDelete(deal.id)}
                onDuplicate={() => onDuplicate(deal.id)}
                isSelected={selectedDeals.includes(deal.id)}
                onToggleSelection={toggleDealSelection}
              />
            ))}
          </div>
        </>
      )}

      {deleteModal && (
        <ConfirmModal
          title={deleteModal.title}
          message={deleteModal.message}
          onConfirm={deleteModal.onConfirm}
          onCancel={deleteModal.onCancel}
        />
      )}

      {showCalculator && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FinancingCalculator onClose={() => setShowCalculator(false)} />
          </div>
        </div>
      )}

      {showComparison && (
        <div className="modal-overlay">
          <div className="modal-content">
            <DealComparison 
              deals={deals} 
              onClose={() => setShowComparison(false)} 
            />
          </div>
        </div>
      )}

      {showAnalytics && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AnalyticsDashboard 
              deals={deals} 
              onClose={() => setShowAnalytics(false)} 
            />
          </div>
        </div>
      )}

      {/* Market Data Modal */}
      {showMarketData && (
        <SimpleMarketDataModal
          isOpen={showMarketData}
          onClose={() => setShowMarketData(false)}
          vehicleData={selectedDeal?.vehicle || null}
        />
      )}

      {/* Financing Offers Modal */}
      {showFinancingOffers && (
        <SimpleFinancingOffers
          isOpen={showFinancingOffers}
          onClose={() => setShowFinancingOffers(false)}
          vehicleData={selectedDeal?.vehicle || null}
        />
      )}
      </div>
    </div>
  )
}

export default SavedDeals