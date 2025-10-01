import React, { useState } from 'react'
import PriceRange from './PriceRange.jsx'
import RangeBadge from './RangeBadge.jsx'
import { useSwipeGesture, triggerHaptic } from '../lib/gestures.js'

function DealCard({ deal, onEdit, onDelete, onDuplicate, isSelected, onToggleSelection }) {
  const [showActions, setShowActions] = useState(false)

  // Swipe gesture handlers
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture(
    () => {
      // Swipe left to delete
      triggerHaptic('warning')
      if (confirm('Delete this deal?')) {
        onDelete(deal.id)
        triggerHaptic('success')
      }
    },
    () => {
      // Swipe right to edit
      triggerHaptic('light')
      onEdit(deal.id)
    }
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleEdit = () => {
    onEdit(deal.id, { status: 'editing' })
  }

  const handleStatusChange = (newStatus) => {
    onEdit(deal.id, { status: newStatus })
  }

  const statusOptions = [
    { value: 'researching', label: 'Researching', color: 'blue' },
    { value: 'visiting', label: 'Visiting', color: 'yellow' },
    { value: 'pending_finance', label: 'Pending Finance', color: 'orange' },
    { value: 'walked_away', label: 'Walked Away', color: 'red' },
    { value: 'purchased', label: 'Purchased', color: 'green' }
  ]

  return (
    <div 
      className={`deal-card ${isSelected ? 'selected' : ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="deal-card-header">
        <div className="deal-title">
          <div className="deal-title-row">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(deal.id)}
              className="deal-checkbox"
            />
            <h3 style={{ color: '#ffffff' }}>{deal.vehicle.year} {deal.vehicle.make} {deal.vehicle.model}</h3>
          </div>
          {deal.vehicle.trim && <span className="deal-trim">{deal.vehicle.trim}</span>}
        </div>
        <div className="deal-actions">
          <button 
            className="action-btn"
            onClick={() => setShowActions(!showActions)}
            title="More actions"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="5" r="1" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="19" r="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="deal-card-content">
        <div className="deal-info">
          <div className="deal-meta">
            <span className="deal-mileage">{deal.vehicle.mileage.toLocaleString()} miles</span>
            <span className="deal-zip">{deal.vehicle.zip}</span>
          </div>
          
          <div className="deal-status">
            <RangeBadge status={deal.status} />
          </div>
        </div>

        <div className="deal-price">
          <PriceRange price={deal.price} />
        </div>

        {deal.photos.length > 0 && (
          <div className="deal-photos">
            <div className="photo-thumbnails">
              {deal.photos.slice(0, 3).map((photo, index) => (
                <div key={index} className="photo-thumbnail">
                  <img src={photo} alt={`Photo ${index + 1}`} />
                </div>
              ))}
              {deal.photos.length > 3 && (
                <div className="photo-more">
                  +{deal.photos.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {deal.notes && (
          <div className="deal-notes">
            <p>{deal.notes}</p>
          </div>
        )}

        <div className="deal-dates">
          <span className="deal-date">Created: {formatDate(deal.createdAt)}</span>
          <span className="deal-date">Updated: {formatDate(deal.updatedAt)}</span>
        </div>
      </div>

      {showActions && (
        <div className="deal-actions-menu">
          <div className="actions-header">
            <h4>Actions</h4>
            <button 
              className="actions-close"
              onClick={() => setShowActions(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="actions-content">
            <div className="status-actions">
              <h5>Change Status</h5>
              <div className="status-buttons">
                {statusOptions.map(status => (
                  <button
                    key={status.value}
                    className={`status-btn ${deal.status === status.value ? 'active' : ''}`}
                    onClick={() => {
                      handleStatusChange(status.value)
                      setShowActions(false)
                    }}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="deal-actions-list">
              <button className="action-item" onClick={handleEdit}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Deal
              </button>
              
              <button className="action-item" onClick={() => onDuplicate(deal.id)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Duplicate Deal
              </button>
              
              <button 
                className="action-item danger"
                onClick={() => {
                  onDelete(deal.id)
                  setShowActions(false)
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DealCard