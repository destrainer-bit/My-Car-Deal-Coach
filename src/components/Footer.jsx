import React from 'react'

function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; {currentYear} The Car Deal Coach. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <button 
            className="footer-link"
            onClick={() => onNavigate('settings')}
          >
            Settings
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer