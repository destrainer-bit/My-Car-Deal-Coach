import React from 'react'
import './progress-dots.css'

function ProgressDots({ current, total, steps = [] }) {
  return (
    <div className="progress-dots">
      <div className="progress-dots__container">
        {Array.from({ length: total }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === current
          const isCompleted = stepNumber < current
          const step = steps[index] || {}
          
          return (
            <div
              key={stepNumber}
              className={`progress-dots__dot ${
                isActive ? 'active' : ''
              } ${isCompleted ? 'completed' : ''}`}
            >
              <div className="progress-dots__number">
                {isCompleted ? '✓' : stepNumber}
              </div>
              {step.title && (
                <div className="progress-dots__label">
                  {step.title}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {steps[current - 1] && (
        <div className="progress-dots__description">
          {steps[current - 1].description}
        </div>
      )}
    </div>
  )
}

export default ProgressDots