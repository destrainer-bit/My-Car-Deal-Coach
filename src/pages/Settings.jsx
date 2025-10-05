import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal.jsx'
import SimpleNegotiatorAgent from '../components/SimpleNegotiatorAgent.jsx'
import PaymentModal from '../components/PaymentModal.jsx'
import FinanceEstimator from '../components/FinanceEstimator.jsx'
import PaymentCalculator from '../components/PaymentCalculator.jsx'
import { 
  exportDealsToJSON, 
  exportDealsToCSV, 
  importDealsFromJSON, 
  generateBackup, 
  restoreFromBackup 
} from '../lib/dataExport.js'
import { triggerHaptic } from '../lib/gestures.js'

function Settings({ onClearData, onExportData, deals, notes, photos, navigateTo }) {
  const navigate = useNavigate();
  const [clearModal, setClearModal] = useState(false)
  const [importModal, setImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [showFinanceEstimator, setShowFinanceEstimator] = useState(false)
  const [showPaymentCalculator, setShowPaymentCalculator] = useState(false)

  // Redirect to custom billing management page instead of Stripe portal

  const handleImportFile = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/json') {
      setImportFile(file)
    } else {
      alert('Please select a valid JSON file.')
    }
  }

  const handleExportJSON = () => {
    triggerHaptic('light')
    exportDealsToJSON(deals, `car-coach-deals-${new Date().toISOString().split('T')[0]}.json`)
  }

  const handleExportCSV = () => {
    triggerHaptic('light')
    exportDealsToCSV(deals, `car-coach-deals-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleExportBackup = () => {
    triggerHaptic('light')
    const backup = generateBackup(deals, notes, photos)
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `car-coach-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    if (!importFile) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // Validate the data structure
        if (data.deals && Array.isArray(data.deals)) {
          // Import the data
          localStorage.setItem('carCoachDeals', JSON.stringify(data.deals))
          localStorage.setItem('carCoachNotes', JSON.stringify(data.notes || ''))
          localStorage.setItem('carCoachPhotos', JSON.stringify(data.photos || []))
          localStorage.setItem('carCoachChecklistProgress', JSON.stringify(data.checklistProgress || {}))
          
          alert('Data imported successfully! Please refresh the page to see your imported data.')
          setImportModal(false)
          setImportFile(null)
        } else {
          alert('Invalid data format. Please make sure this is a valid Car Deal Coach export file.')
        }
      } catch (error) {
        alert('Error reading file. Please make sure it\'s a valid JSON file.')
      }
    }
    reader.readAsText(importFile)
  }

  const appInfo = {
    name: 'Car Deal Coach',
    version: '1.0.0',
    description: 'Complete car buying platform with AI negotiation coach, real-time market data, finance tools, and deal tracking',
    features: [
      'AI-Powered Negotiation Coach - Personalized scripts and strategies',
      'Real-Time Market Data - Live pricing from AutoTrader, Cars.com, CarGurus',
      'Advanced Finance Calculator - APR analysis and payment breakdowns',
      'Deal Tracking System - Track multiple car deals with photos and notes',
      'Step-by-Step Checklist - Complete negotiation and buying guide',
      'Photo Management - Upload and organize car photos and documents',
      'Notes & Reminders - Keep track of conversations and important details',
      'Regional Market Analysis - ZIP code-based pricing adjustments',
      'Trade-In Valuation - Separate trade-in tracking and valuation',
      'Payment Calculator - Monthly payment and loan term analysis',
      'Mobile-First Design - Optimized for smartphone use',
      'Cloud Backup - Export/import deals and data',
      'Red Flag Alerts - Spot hidden fees and dealer tactics',
      'Savings Tracking - Calculate potential savings and overpayments',
      'Secure Data Storage - Your information stays private',
      'Comprehensive Guides - How-to guides and legal information',
      'Customizable Settings - Personalize your experience',
      'Real-Time Updates - Always current market data and pricing'
    ]
  }

    return (
      <div className="mobile-first-settings">
        <div className="mobile-first-settings-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button 
            onClick={() => navigate('/app')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto 1rem auto'
            }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#ffffff', 
            marginBottom: '0.5rem' 
          }}>
            ⚙️ Settings
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#e2e8f0', 
            marginBottom: '2rem' 
          }}>
            Customize your Car Deal Coach experience
          </p>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          
          {/* Subscription Card */}
          <div className="settings-card">
            <h2>💳 Subscription</h2>
            
            <div className="settings-card-content">
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Current Plan
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Basic Plan - Core features included
                </p>
              </div>
            </div>
            
            <div className="settings-card-actions">
              <button 
                onClick={() => window.location.href = '/app/upgrade'}
                className="btn"
              >
                🚀 View Upgrade Options
              </button>
              <button 
                onClick={() => navigate('/app/billing')}
                className="btn btn-secondary"
              >
                💳 Manage Billing
              </button>
            </div>
          </div>
        </div>

          {/* Finance Tools Card */}
          <div className="settings-card">
            <h2>🧮 Finance Tools</h2>
            
            <div className="settings-card-content">
              {/* Empty content area to push buttons to bottom */}
            </div>
            
            <div className="settings-card-actions">
              <button 
                onClick={() => setShowFinanceEstimator(true)}
                className="btn"
                style={{ background: '#3b82f6' }}
              >
                💰 Calculate Financing
              </button>
              <button 
                onClick={() => setShowPaymentCalculator(true)}
                className="btn"
                style={{ background: '#8b5cf6' }}
              >
                🧮 Calculate Rate
              </button>
            </div>
          </div>
        </div>

          {/* Help & Support Card */}
          <div className="settings-card">
            <h2>📚 Help & Support</h2>
            
            <div className="settings-card-content">
              {/* Empty content area to push buttons to bottom */}
            </div>
            
            <div className="settings-card-actions">
              <button 
                onClick={() => navigate('/app/how-to-use')}
                className="btn"
              >
                📚 View Guide
              </button>
              <button 
                onClick={() => navigate('/app/legal')}
                className="btn"
                style={{ background: '#dc2626' }}
              >
                ⚖️ Legal Information
              </button>
            </div>
          </div>
        </div>

          {/* Quick Actions Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ⚡ Quick Actions
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => navigate('/app/create-deal')}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                📝 Create New Deal
              </button>
              <button 
                onClick={() => navigate('/app/saved-deals')}
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                💾 View Saved Deals
              </button>
              <button 
                onClick={() => navigate('/app/checklist')}
                style={{
                  background: '#8b5cf6',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ✅ Deal Checklist
              </button>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            💾 Data Management
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Export Section */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
                Export Data
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
                Download your deals, notes, and photos
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  onClick={handleExportJSON}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📄 Export JSON
                </button>
                <button 
                  onClick={handleExportCSV}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📊 Export CSV
                </button>
                <button 
                  onClick={handleExportBackup}
                  style={{
                    background: '#8b5cf6',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  💾 Full Backup
                </button>
              </div>
            </div>

            {/* Import Section */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
                Import Data
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
                Restore from backup or import deals
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  onClick={() => setImportModal(true)}
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📥 Import Backup
                </button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  style={{ display: 'none' }}
                  id="import-file"
                />
                <label 
                  htmlFor="import-file"
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textAlign: 'center'
                  }}
                >
                  📁 Choose File
                </label>
              </div>
            </div>

            {/* Clear Data Section */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
                Clear All Data
              </h3>
              <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem' }}>
                ⚠️ This will permanently delete all your data
              </p>
              <button 
                onClick={() => setClearModal(true)}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                🗑️ Clear All Data
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 style={{ color: '#ffffff' }}>About</h2>
          <div className="app-info">
            <div className="app-logo">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="16" fill="var(--color-primary)" opacity="0.1"/>
                <circle cx="32" cy="32" r="20" fill="none" stroke="var(--color-primary)" strokeWidth="3"/>
                <circle cx="32" cy="32" r="16" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.6"/>
                <circle cx="32" cy="32" r="6" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.3"/>
                <circle cx="32" cy="32" r="3" fill="var(--color-primary)"/>
              </svg>
            </div>
            <div className="app-details">
              <h3 style={{ color: '#ffffff' }}>{appInfo.name}</h3>
              <p style={{ color: '#ffffff' }}>Version {appInfo.version}</p>
              <p style={{ color: '#ffffff' }}>{appInfo.description}</p>
            </div>
          </div>

          <div className="features-list">
            <h4 style={{ color: '#ffffff' }}>Features:</h4>
            <ul>
              {appInfo.features.map((feature, index) => (
                <li key={index} style={{ color: '#ffffff' }}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>


        <div className="settings-section">
          <h2 style={{ color: '#ffffff' }}>Personal Negotiator Agent</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3 style={{ color: '#ffffff' }}>The Negotiator</h3>
              <p style={{ color: '#ffffff' }}>Personal negotiation assistant for car deals</p>
            </div>
          </div>
          <SimpleNegotiatorAgent />
        </div>
      </div>

      {clearModal && (
        <ConfirmModal
          title="Clear All Data"
          message="Are you sure you want to delete all your deals, notes, and photos? This action cannot be undone."
          onConfirm={() => {
            onClearData()
            setClearModal(false)
          }}
          onCancel={() => setClearModal(false)}
        />
      )}

      {importModal && (
        <div className="modal-overlay" onClick={() => setImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Import Data</h3>
              <button 
                className="modal-close"
                onClick={() => setImportModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Select a JSON file exported from Car Deal Coach:</p>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="file-input"
              />
              {importFile && (
                <div className="file-info">
                  <p>Selected: {importFile.name}</p>
                  <p>Size: {(importFile.size / 1024).toFixed(1)} KB</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setImportModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleImportData}
                disabled={!importFile}
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinanceEstimator && (
        <div className="modal-overlay">
          <div className="modal-content finance-modal">
            <FinanceEstimator 
              onClose={() => setShowFinanceEstimator(false)}
              onEstimate={(result) => {
                console.log('Finance estimate:', result)
                // You can add logic here to save the estimate or show additional options
              }}
            />
          </div>
        </div>
      )}

      {showPaymentCalculator && (
        <div className="modal-overlay">
          <div className="modal-content finance-modal">
            <PaymentCalculator 
              onClose={() => setShowPaymentCalculator(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings