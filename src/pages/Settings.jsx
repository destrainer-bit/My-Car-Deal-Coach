import React, { useState } from 'react'
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
  const [clearModal, setClearModal] = useState(false)
  const [importModal, setImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [showFinanceEstimator, setShowFinanceEstimator] = useState(false)
  const [showPaymentCalculator, setShowPaymentCalculator] = useState(false)

  const billingPortalUrl = import.meta.env.VITE_STRIPE_BILLING_PORTAL_URL || 'https://billing.stripe.com/p/login'

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
    description: 'Your personal car-buying assistant',
    features: [
      'Smart price estimation',
      'Negotiation checklists',
      'Deal tracking',
      'Photo management',
      'Notes and reminders'
    ]
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h1 style={{ color: '#ffffff' }}>Settings</h1>
        <p style={{ color: '#ffffff' }}>Customize your Car Deal Coach experience</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2 style={{ color: '#ffffff' }}>Subscription</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3 style={{ color: '#ffffff' }}>Current Plan</h3>
              <p style={{ color: '#ffffff' }}>Basic Plan - Core features included</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => window.open('#/upgrade', '_self')}
            >
              🚀 View Upgrade Options
            </button>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3 style={{ color: '#ffffff' }}>Manage Subscription</h3>
              <p style={{ color: '#ffffff' }}>Update payment method or cancel subscription</p>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => window.open(billingPortalUrl, '_blank')}
            >
              💳 Manage Billing
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2 style={{ color: '#ffffff' }}>Finance Tools</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3 style={{ color: '#ffffff' }}>Finance Calculator</h3>
              <p style={{ color: '#ffffff' }}>Get instant financing estimates and negotiation tips</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowFinanceEstimator(true)}
            >
              💰 Calculate Financing
            </button>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3 style={{ color: '#ffffff' }}>Payment Calculator</h3>
              <p style={{ color: '#ffffff' }}>Enter dealer worksheet to calculate your actual interest rate</p>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowPaymentCalculator(true)}
            >
              🧮 Calculate Rate
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2 style={{ color: '#ffffff' }}>Help & Support</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3 style={{ color: '#ffffff' }}>How to Use</h3>
              <p style={{ color: '#ffffff' }}>Complete guide to using all features effectively</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => navigateTo('how-to-use')}
            >
              📚 View Guide
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigateTo('legal')}
            >
              ⚖️ Legal Information
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2 style={{ color: '#ffffff' }}>Data Management</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3 style={{ color: '#ffffff' }}>Export Data</h3>
              <p style={{ color: '#ffffff' }}>Download your data in various formats</p>
            </div>
            <div className="export-buttons">
              <button className="btn btn-secondary btn-small" onClick={handleExportJSON}>
                JSON
              </button>
              <button className="btn btn-secondary btn-small" onClick={handleExportCSV}>
                CSV
              </button>
              <button className="btn btn-secondary btn-small" onClick={handleExportBackup}>
                Full Backup
              </button>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3 style={{ color: '#ffffff' }}>Import Data</h3>
              <p style={{ color: '#ffffff' }}>Restore data from a previous export</p>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setImportModal(true)}
            >
              Import Data
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3 style={{ color: '#ffffff' }}>Clear All Data</h3>
              <p style={{ color: '#ffffff' }}>Permanently delete all your deals, notes, and photos</p>
            </div>
            <button 
              className="btn btn-danger"
              onClick={() => setClearModal(true)}
            >
              Clear All Data
            </button>
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
          <h2 style={{ color: '#ffffff' }}>Future Integration</h2>
          <div className="integration-info">
            <p style={{ color: '#ffffff' }}>
              <strong style={{ color: '#ffffff' }}>Supabase Integration:</strong> This app is designed to easily connect 
              to Supabase for cloud storage and real-time synchronization. 
              See <code style={{ color: '#ffffff' }}>src/lib/supabase-hooks.js</code> for integration points.
            </p>
            <div className="integration-features">
              <h4 style={{ color: '#ffffff' }}>Planned Features:</h4>
              <ul>
                <li style={{ color: '#ffffff' }}>Cloud backup and sync</li>
                <li style={{ color: '#ffffff' }}>Real-time collaboration</li>
                <li style={{ color: '#ffffff' }}>Advanced analytics</li>
                <li style={{ color: '#ffffff' }}>Dealer network integration</li>
              </ul>
            </div>
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