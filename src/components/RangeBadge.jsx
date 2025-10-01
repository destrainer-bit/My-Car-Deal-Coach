import React from 'react'

function RangeBadge({ status, size = 'medium' }) {
  const statusConfig = {
    researching: { 
      label: 'Researching', 
      color: 'blue', 
      icon: '🔍' 
    },
    visiting: { 
      label: 'Visiting', 
      color: 'yellow', 
      icon: '🚗' 
    },
    pending_finance: { 
      label: 'Pending Finance', 
      color: 'orange', 
      icon: '📋' 
    },
    walked_away: { 
      label: 'Walked Away', 
      color: 'red', 
      icon: '🚶' 
    },
    purchased: { 
      label: 'Purchased', 
      color: 'green', 
      icon: '✅' 
    }
  }

  const config = statusConfig[status] || { 
    label: 'Unknown', 
    color: 'gray', 
    icon: '❓' 
  }

  return (
    <span className={`range-badge ${config.color} ${size}`}>
      <span className="badge-icon">{config.icon}</span>
      <span className="badge-label">{config.label}</span>
    </span>
  )
}

export default RangeBadge