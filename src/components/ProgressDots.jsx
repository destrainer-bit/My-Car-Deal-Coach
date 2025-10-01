import React from 'react'

function ProgressDots({ current, total, steps = [] }) {
  return (
    <div className="progress-dots">
      <div className="progress-track">
        {Array.from({ length: total }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === current
          const isCompleted = stepNumber < current
          const step = steps[index] || { title: `Step ${stepNumber}` }

          return (
            <div key={stepNumber} className="progress-step">
              <div className={`step-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                {step.description && (
                  <div className="step-description">{step.description}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${((current - 1) / (total - 1)) * 100}%` 
          }}
        />
      </div>
    </div>
  )
}

export default ProgressDots