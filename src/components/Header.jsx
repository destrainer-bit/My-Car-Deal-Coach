import React from 'react'

function Header({ searchQuery, onSearchChange, currentPage, onNavigate }) {
  const navigationItems = [
    { id: 'deals', label: 'Deals', icon: '📋' },
    { id: 'checklist', label: 'Checklist', icon: '✅' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo" onClick={() => onNavigate('onboarding')}>
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="var(--color-primary)" opacity="0.1"/>
              <circle cx="32" cy="32" r="20" fill="none" stroke="var(--color-primary)" strokeWidth="3"/>
              <circle cx="32" cy="32" r="16" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.6"/>
              <circle cx="32" cy="32" r="6" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.3"/>
              <circle cx="32" cy="32" r="3" fill="var(--color-primary)"/>
            </svg>
            <span>The Car Deal Coach</span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => onSearchChange('')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="header-right">
          <a
            href="https://chatgpt.com/g/g-68d8a61f4f888191b31500953d037590-the-negotiator"
            target="_blank"
            rel="noopener noreferrer"
            className="negotiator-link"
            title="Open The Negotiator GPT"
          >
            Negotiator
          </a>
          <nav className="header-nav">
            {navigationItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header