import React from 'react'

const navigationItems = [
  { id: 'deals', label: 'Deals', icon: 'folder' },
  { id: 'checklist', label: 'Checklist', icon: 'check' },
  { id: 'notes', label: 'Notes', icon: 'note' },
  { id: 'settings', label: 'Settings', icon: 'settings' }
]

function buildIcon(id) {
  switch (id) {
    case 'folder':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H10l2 2.5H18.5A2.5 2.5 0 0 1 21 11v7.5A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5V8.5Z" />
        </svg>
      )
    case 'check':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'note':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 3h8l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M14 3v6h6" />
          <path d="M9 13h6" strokeLinecap="round" />
          <path d="M9 17h4" strokeLinecap="round" />
        </svg>
      )
    case 'settings':
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="m12 15 0 0" strokeLinecap="round" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.4 1.31 1.02 1.58.54.22 1.15.21 1.67-.04" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
  }
}

export default function Shell({
  children,
  currentPage,
  onNavigate,
  searchQuery,
  onSearchChange,
  onUpgrade
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <div className="app-shell theme-dark dark">
      <header className="app-shell__header">
        <div className="app-shell__brand" onClick={() => onNavigate('onboarding')}>
          <div className="brand-mark">
            <div className="brand-ring" />
            <div className="brand-core" />
          </div>
          <div className="brand-copy">
            <span className="brand-name">Car Deal Coach</span>
            <span className="brand-tag">Buy smart. Negotiate smarter.</span>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <nav className={`app-shell__nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-tab ${currentPage === item.id ? 'is-active' : ''}`}
              onClick={() => {
                onNavigate(item.id)
                setMobileMenuOpen(false)
              }}
            >
              <span className="nav-tab__icon">{buildIcon(item.icon)}</span>
              <span className="nav-tab__label">{item.label}</span>
            </button>
          ))}
          <button
            className={`nav-tab nav-tab--accent ${currentPage === 'upgrade' ? 'is-active' : ''}`}
            onClick={() => {
              onUpgrade()
              setMobileMenuOpen(false)
            }}
          >
            <span className="nav-tab__label">Upgrade</span>
          </button>
        </nav>
        <div className="app-shell__search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" strokeLinecap="round" />
          </svg>
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search deals, notes, or steps"
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="app-shell__actions" />
      </header>

      <div className="app-shell__layout">
        <aside className="app-shell__sidebar">
          <div className="sidebar-card">
            <h3>Need a play?</h3>
            <p>Use the Personal Negotiator Agent for scripts, red flags, and talk tracks.</p>
            <button className="sidebar-btn" onClick={() => window.open('https://chatgpt.com/g/g-68d8a61f4f888191b31500953d037590-the-negotiator', '_blank')}>
              Open Agent
            </button>
          </div>
        </aside>

        <main className="app-shell__main">
          {children}
        </main>
      </div>

      <footer className="app-shell__footer">
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} Car Deal Coach</span>
          <span className="divider">•</span>
          <button onClick={() => onNavigate('legal')} className="footer-link">Legal</button>
          <button onClick={() => onNavigate('settings')} className="footer-link">Settings</button>
        </div>
        <div className="footer-meta">
          <span>Built for buyers, not dealers.</span>
        </div>
      </footer>
    </div>
  )
}
