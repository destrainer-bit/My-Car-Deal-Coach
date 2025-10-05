import React from 'react'

function PricingDisclaimer({ zipCode = '90210' }) {
  return (
    <div style={{ 
      marginTop: '1rem',
      padding: '1rem',
      background: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      fontSize: '0.875rem'
    }}>
      <h4 style={{ 
        color: '#92400e', 
        margin: '0 0 0.75rem 0', 
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        ⚠️ Important Pricing Information
      </h4>
      
      <div style={{ color: '#92400e', marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          <strong>What these prices represent:</strong>
        </p>
        <ul style={{ margin: '0 0 0.5rem 0', paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>Retail market averages</strong> - what cars sell for to consumers
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>Not wholesale/auction prices</strong> - what dealers pay for cars
          </li>
          <li>
            Based on actual listings in your area, adjusted for regional market conditions
          </li>
        </ul>
      </div>

      <div style={{ color: '#92400e', marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
          💡 Pro Tips for Better Deals:
        </p>
        <ul style={{ margin: '0 0 0.5rem 0', paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>Get a CarMax quote</strong> - most major manufacturers honor CarMax trade-in quotes
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>Shop multiple dealers</strong> - prices can vary significantly between locations
          </li>
          <li>
            <strong>Timing matters</strong> - end of month/quarter often has better deals
          </li>
        </ul>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => window.open(`https://www.carmax.com/cars?zip=${zipCode}`, '_blank')}
          style={{
            background: '#059669',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginRight: '0.5rem'
          }}
        >
          🔍 Find CarMax Near You
        </button>
        
        <button 
          onClick={() => window.open('https://www.kbb.com/', '_blank')}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📊 Check KBB Values
        </button>
      </div>
    </div>
  )
}

export default PricingDisclaimer
