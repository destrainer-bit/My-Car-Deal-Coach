import React from 'react'

function SimpleApp() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>The Car Deal Coach</h1>
      <p>Welcome to your car buying assistant!</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Start a Deal
      </button>
    </div>
  )
}

export default SimpleApp




