import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RangeBadge from '../components/RangeBadge.jsx'

function Checklist({ deals, progress, onUpdateProgress }) {
  const navigate = useNavigate()
  const [selectedDeal, setSelectedDeal] = useState(null)

  const checklistItems = {
    before_visit: [
      { id: 'research_price', text: 'Research fair market value', category: 'Research' },
      { id: 'check_history', text: 'Check vehicle history report', category: 'Research' },
      { id: 'inspect_photos', text: 'Review all photos carefully', category: 'Research' },
      { id: 'prepare_questions', text: 'Prepare questions for dealer', category: 'Research' },
      { id: 'set_budget', text: 'Set maximum budget limit', category: 'Budget' },
      { id: 'get_financing', text: 'Get pre-approved for financing', category: 'Budget' }
    ],
    at_dealership: [
      { id: 'test_drive', text: 'Take thorough test drive', category: 'Inspection' },
      { id: 'inspect_exterior', text: 'Inspect exterior for damage', category: 'Inspection' },
      { id: 'inspect_interior', text: 'Check interior condition', category: 'Inspection' },
      { id: 'check_engine', text: 'Check engine and mechanical', category: 'Inspection' },
      { id: 'verify_features', text: 'Verify all features work', category: 'Inspection' },
      { id: 'negotiate_price', text: 'Negotiate final price', category: 'Negotiation' },
      { id: 'ask_about_fees', text: 'Ask about all fees and charges', category: 'Negotiation' }
    ],
    finance_office: [
      { id: 'review_contract', text: 'Review contract thoroughly', category: 'Finance' },
      { id: 'check_interest_rate', text: 'Verify interest rate', category: 'Finance' },
      { id: 'understand_payment', text: 'Understand payment terms', category: 'Finance' },
      { id: 'check_warranty', text: 'Review warranty options', category: 'Finance' },
      { id: 'ask_about_gap', text: 'Ask about gap insurance', category: 'Finance' },
      { id: 'finalize_paperwork', text: 'Complete all paperwork', category: 'Finance' }
    ],
    after_purchase: [
      { id: 'morning_review', text: 'Morning-after paperwork review', category: 'Follow-up' },
      { id: 'register_vehicle', text: 'Register vehicle with DMV', category: 'Follow-up' },
      { id: 'update_insurance', text: 'Update insurance policy', category: 'Follow-up' },
      { id: 'schedule_service', text: 'Schedule first service', category: 'Follow-up' }
    ]
  }

  const toggleItem = (dealId, itemId) => {
    const key = `${dealId}_${itemId}`
    const newProgress = { ...progress }
    newProgress[key] = !newProgress[key]
    onUpdateProgress(newProgress)
  }

  const getProgressForDeal = (dealId) => {
    const allItems = Object.values(checklistItems).flat()
    const totalItems = allItems.length
    const completedItems = allItems.filter(item => 
      progress[`${dealId}_${item.id}`]
    ).length
    return { completed: completedItems, total: totalItems }
  }

  const getCategoryProgress = (dealId, category) => {
    const items = checklistItems[category]
    const completed = items.filter(item => 
      progress[`${dealId}_${item.id}`]
    ).length
    return { completed, total: items.length }
  }

  const renderChecklistSection = (dealId, category, items) => {
    const categoryProgress = getCategoryProgress(dealId, category)
    const categoryNames = {
      before_visit: 'Before Your Visit',
      at_dealership: 'At the Dealership',
      finance_office: 'Finance Office',
      after_purchase: 'After Purchase'
    }

    return (
      <div key={category} className="checklist-section">
        <div className="section-header">
          <h3 style={{ color: '#ffffff' }}>{categoryNames[category]}</h3>
          <div className="section-progress">
            <span className="progress-text" style={{ color: '#ffffff' }}>
              {categoryProgress.completed}/{categoryProgress.total}
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(categoryProgress.completed / categoryProgress.total) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
        <div className="checklist-items">
          {items.map(item => (
            <label key={item.id} className="checklist-item">
              <input
                type="checkbox"
                checked={progress[`${dealId}_${item.id}`] || false}
                onChange={() => toggleItem(dealId, item.id)}
              />
              <span className="item-text" style={{ color: '#ffffff' }}>{item.text}</span>
              <span className="item-category" style={{ color: '#ffffff' }}>{item.category}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  const renderDealSelector = () => (
    <div className="deal-selector">
      <div className="deal-selector-header">
        <h2 style={{ color: '#ffffff' }}>Select a Deal</h2>
        <button className="btn btn-primary" onClick={() => navigate('/app')}>
          🏠 Back to Main
        </button>
      </div>
      <div className="deals-list">
        {deals.map(deal => {
          const dealProgress = getProgressForDeal(deal.id)
          return (
            <div 
              key={deal.id} 
              className={`deal-option ${selectedDeal?.id === deal.id ? 'selected' : ''}`}
              onClick={() => setSelectedDeal(deal)}
            >
              <div className="deal-info">
                <h3 style={{ color: '#ffffff' }}>{deal.vehicle.year} {deal.vehicle.make} {deal.vehicle.model}</h3>
                <p style={{ color: '#ffffff' }}>{deal.vehicle.mileage.toLocaleString()} miles</p>
                <RangeBadge status={deal.status} />
              </div>
              <div className="deal-progress">
                <div className="progress-circle">
                  <span>{dealProgress.completed}/{dealProgress.total}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(dealProgress.completed / dealProgress.total) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderChecklist = () => {
    if (!selectedDeal) return null

    return (
      <div className="checklist-content">
        <div className="checklist-header">
          <h2 style={{ color: '#ffffff' }}>Negotiation Checklist</h2>
          <div className="deal-summary">
            <h3 style={{ color: '#ffffff' }}>{selectedDeal.vehicle.year} {selectedDeal.vehicle.make} {selectedDeal.vehicle.model}</h3>
            <p style={{ color: '#ffffff' }}>{selectedDeal.vehicle.mileage.toLocaleString()} miles • {selectedDeal.vehicle.zip}</p>
            <RangeBadge status={selectedDeal.status} />
          </div>
          <div className="checklist-actions">
            <button className="btn btn-secondary" onClick={() => setSelectedDeal(null)}>
              ← Back to Deals
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/app')}>
              🏠 Back to Main
            </button>
          </div>
        </div>

        <div className="checklist-sections">
          {Object.entries(checklistItems).map(([category, items]) => 
            renderChecklistSection(selectedDeal.id, category, items)
          )}
        </div>
      </div>
    )
  }

  if (deals.length === 0) {
    return (
      <div className="checklist">
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="var(--color-primary)" opacity="0.1"/>
              <path d="M20 32h24M32 20v24" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="32" cy="32" r="8" fill="none" stroke="var(--color-primary)" strokeWidth="2"/>
            </svg>
          </div>
          <h2>No deals to track</h2>
          <p>Create a deal first to access your negotiation checklist.</p>
          <div className="empty-actions">
            <button className="btn btn-primary" onClick={() => navigate('/app')}>
              🏠 Back to Main
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-first-checklist">
      <div className="mobile-first-checklist-container">
      {!selectedDeal ? renderDealSelector() : (
        <>
          <div className="checklist-nav">
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedDeal(null)}
            >
              ← Back to Deals
            </button>
          </div>
          {renderChecklist()}
        </>
      )}
      </div>
    </div>
  )
}

export default Checklist