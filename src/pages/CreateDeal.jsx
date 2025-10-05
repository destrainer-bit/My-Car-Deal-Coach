import React, { useState, useEffect } from 'react'
import { estimatePriceRange, estimatePriceRangeWithMarketData } from '../lib/pricing.js'
import { validateDealData } from '../lib/validators.js'
import ProgressDots from '../components/ProgressDots.jsx'
import PhotoUploader from '../components/PhotoUploader.jsx'
import PriceRange from '../components/PriceRange.jsx'
import '../styles/mobile-first.css'

function CreateDeal({ onSave, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [priceRange, setPriceRange] = useState(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
    mileage: '',
    zipCode: '',
    location: '',
    vehicleType: 'used', // 'new' or 'used'
    condition: 3, // Keep for used cars
    conditionNotes: [],
    photos: [],
    notes: '',
    // Trade-in data
    hasTradeIn: false,
    tradeYear: '',
    tradeMake: '',
    tradeModel: '',
    tradeTrim: '',
    tradeMileage: '',
    tradeCondition: 3,
    tradeConditionNotes: [],
    tradePhotos: [],
    tradeNotes: ''
  })

  const steps = [
    { title: 'Vehicle Basics', description: 'Tell us about the car you want to buy' },
    { title: 'Vehicle Details', description: 'New or used, condition, and location' },
    { title: 'Trade-In (Optional)', description: 'Add your trade-in vehicle if you have one' },
    { title: 'Price Estimate', description: 'See your price range' },
    { title: 'Summary', description: 'Review and save' }
  ]

  const conditionOptions = [
    { value: 1, label: '1 Poor', description: 'Major issues, high mileage' },
    { value: 2, label: '2 Fair', description: 'Some wear, minor issues' },
    { value: 3, label: '3 Good', description: 'Normal wear, well maintained' },
    { value: 4, label: '4 Very Good', description: 'Minimal wear, excellent condition' },
    { value: 5, label: '5 Excellent', description: 'Like new, perfect condition' }
  ]

  const conditionFlags = [
    { id: 'clean_interior', label: 'Clean Interior' },
    { id: 'no_accidents', label: 'No Accidents' },
    { id: 'service_records', label: 'Service Records' },
    { id: 'garage_kept', label: 'Garage Kept' },
    { id: 'low_mileage', label: 'Low Mileage' },
    { id: 'one_owner', label: 'One Owner' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConditionFlagToggle = (flagId) => {
    setFormData(prev => ({
      ...prev,
      conditionNotes: prev.conditionNotes.includes(flagId)
        ? prev.conditionNotes.filter(id => id !== flagId)
        : [...prev.conditionNotes, flagId]
    }))
  }

  const handleTradeConditionFlagToggle = (flagId) => {
    setFormData(prev => ({
      ...prev,
      tradeConditionNotes: prev.tradeConditionNotes.includes(flagId)
        ? prev.tradeConditionNotes.filter(id => id !== flagId)
        : [...prev.tradeConditionNotes, flagId]
    }))
  }

  const handlePhotoAdd = (photoDataUrl) => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, photoDataUrl]
    }))
  }

  const handlePhotoRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleTradePhotoAdd = (photoDataUrl) => {
    setFormData(prev => ({
      ...prev,
      tradePhotos: [...prev.tradePhotos, photoDataUrl]
    }))
  }

  const handleTradePhotoRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      tradePhotos: prev.tradePhotos.filter((_, i) => i !== index)
    }))
  }

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.year && formData.make && formData.model && formData.mileage && formData.zipCode
      case 2:
        return true // Vehicle details are always valid
      case 3:
        // Trade-in step is always valid (optional)
        return true
      case 4:
        return true // Price is calculated
      case 5:
        return true // Summary is always valid
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 5 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    const validation = validateDealData(formData)
    if (validation.isValid) {
      onSave(formData)
    } else {
      alert('Please fix the following errors:\n' + validation.errors.join('\n'))
    }
  }

  // Calculate pricing when we reach step 4 (Price Estimate)
  useEffect(() => {
    if (currentStep === 4 && formData.year && formData.make && formData.model && formData.zipCode) {
      setPriceLoading(true)
      estimatePriceRangeWithMarketData(formData)
        .then(result => {
          setPriceRange(result)
          setPriceLoading(false)
        })
        .catch(error => {
          console.error('Pricing calculation failed:', error)
          // Fallback to algorithm pricing
          const fallbackPrice = estimatePriceRange(formData)
          setPriceRange(fallbackPrice)
          setPriceLoading(false)
        })
    }
  }, [currentStep, formData.year, formData.make, formData.model, formData.zipCode])

  const renderStep1 = () => (
    <div className="create-deal-step">
      <h2>Car You Want to Buy</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '1rem' }}>
        Enter details about the car you're interested in purchasing. This helps us provide accurate pricing and negotiation guidance.
      </p>
      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #0ea5e9', 
        borderRadius: '8px', 
        padding: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <p style={{ color: '#0369a1', margin: 0, fontSize: '0.875rem' }}>
          <strong>Note:</strong> This is about the car you want to BUY, not a trade-in. If you have a trade-in, we'll handle that separately in the financing section.
        </p>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="year">Year *</label>
          <input
            type="number"
            id="year"
            value={formData.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            placeholder="2020"
            min="1990"
            max={new Date().getFullYear() + 1}
          />
        </div>
        <div className="form-group">
          <label htmlFor="make">Make *</label>
          <input
            type="text"
            id="make"
            value={formData.make}
            onChange={(e) => handleInputChange('make', e.target.value)}
            placeholder="Toyota"
          />
        </div>
        <div className="form-group">
          <label htmlFor="model">Model *</label>
          <input
            type="text"
            id="model"
            value={formData.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            placeholder="Camry"
          />
        </div>
        <div className="form-group">
          <label htmlFor="trim">Trim</label>
          <input
            type="text"
            id="trim"
            value={formData.trim}
            onChange={(e) => handleInputChange('trim', e.target.value)}
            placeholder="LE, XLE, etc."
          />
        </div>
        <div className="form-group">
          <label htmlFor="mileage">Mileage *</label>
          <input
            type="number"
            id="mileage"
            value={formData.mileage}
            onChange={(e) => handleInputChange('mileage', e.target.value)}
            placeholder="45000"
            min="0"
            max="500000"
          />
        </div>
        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code *</label>
          <input
            type="text"
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            placeholder="90210"
            pattern="[0-9]{5}(-[0-9]{4})?"
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="create-deal-step">
      <h2>Vehicle Details</h2>
      
      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label>Is this a new or used car? *</label>
        <div className="mobile-first-radio-group">
          <label className="mobile-first-radio-label">
            <input
              type="radio"
              name="vehicleType"
              value="new"
              checked={formData.vehicleType === 'new'}
              onChange={(e) => handleInputChange('vehicleType', e.target.value)}
            />
            <span>New Car</span>
          </label>
          <label className="mobile-first-radio-label">
            <input
              type="radio"
              name="vehicleType"
              value="used"
              checked={formData.vehicleType === 'used'}
              onChange={(e) => handleInputChange('vehicleType', e.target.value)}
            />
            <span>Used Car</span>
          </label>
        </div>
      </div>

      {formData.vehicleType === 'used' && (
        <>
          <div className="condition-rating" style={{ marginBottom: '2rem' }}>
            <label>Overall Condition (for used cars)</label>
            <div className="condition-slider">
              <input
                type="range"
                min="1"
                max="5"
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', parseInt(e.target.value))}
                className="slider"
              />
              <div className="mobile-first-condition-options">
                {conditionOptions.map(option => (
                  <label key={option.value} className={`mobile-first-condition-option ${formData.condition === option.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="condition"
                      value={option.value}
                      checked={formData.condition === option.value}
                      onChange={(e) => handleInputChange('condition', parseInt(e.target.value))}
                    />
                    <div className="mobile-first-condition-content">
                      <h4>{option.label}</h4>
                      <p>{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="condition-flags">
            <label>Additional Notes (for used cars)</label>
            <div className="condition-flags">
              {conditionFlags.map(flag => (
                <div key={flag.id} className={`condition-flag ${formData.conditionNotes.includes(flag.id) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={formData.conditionNotes.includes(flag.id)}
                    onChange={() => handleConditionFlagToggle(flag.id)}
                  />
                  <label>{flag.label}</label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label htmlFor="location">Location (City, State)</label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Los Angeles, CA"
        />
      </div>

      <div className="photo-upload">
        <label>Photos (Optional)</label>
        <PhotoUploader
          photos={formData.photos}
          onAdd={handlePhotoAdd}
          onRemove={handlePhotoRemove}
          maxPhotos={5}
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="create-deal-step">
      <h2>Trade-In Vehicle (Optional)</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '1rem' }}>
        Do you have a vehicle to trade in? This information can help with negotiations and financing.
      </p>
      
      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label>Do you have a trade-in vehicle?</label>
        <div className="mobile-first-radio-group">
          <label className="mobile-first-radio-label">
            <input
              type="radio"
              name="hasTradeIn"
              value="true"
              checked={formData.hasTradeIn === true}
              onChange={(e) => handleInputChange('hasTradeIn', e.target.value === 'true')}
            />
            <span>Yes, I have a trade-in</span>
          </label>
          <label className="mobile-first-radio-label">
            <input
              type="radio"
              name="hasTradeIn"
              value="false"
              checked={formData.hasTradeIn === false}
              onChange={(e) => handleInputChange('hasTradeIn', e.target.value === 'true')}
            />
            <span>No trade-in</span>
          </label>
        </div>
      </div>

      {formData.hasTradeIn && (
        <>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="tradeYear">Year *</label>
              <input
                type="number"
                id="tradeYear"
                value={formData.tradeYear}
                onChange={(e) => handleInputChange('tradeYear', e.target.value)}
                placeholder="2018"
                min="1990"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tradeMake">Make *</label>
              <input
                type="text"
                id="tradeMake"
                value={formData.tradeMake}
                onChange={(e) => handleInputChange('tradeMake', e.target.value)}
                placeholder="Honda"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tradeModel">Model *</label>
              <input
                type="text"
                id="tradeModel"
                value={formData.tradeModel}
                onChange={(e) => handleInputChange('tradeModel', e.target.value)}
                placeholder="Civic"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tradeTrim">Trim</label>
              <input
                type="text"
                id="tradeTrim"
                value={formData.tradeTrim}
                onChange={(e) => handleInputChange('tradeTrim', e.target.value)}
                placeholder="LX, EX, etc."
              />
            </div>
            <div className="form-group">
              <label htmlFor="tradeMileage">Mileage *</label>
              <input
                type="number"
                id="tradeMileage"
                value={formData.tradeMileage}
                onChange={(e) => handleInputChange('tradeMileage', e.target.value)}
                placeholder="75000"
                min="0"
                max="500000"
              />
            </div>
          </div>

          <div className="condition-rating" style={{ marginBottom: '2rem' }}>
            <label>Trade-in Condition</label>
            <div className="condition-slider">
              <input
                type="range"
                min="1"
                max="5"
                value={formData.tradeCondition}
                onChange={(e) => handleInputChange('tradeCondition', parseInt(e.target.value))}
                className="slider"
              />
              <div className="condition-labels">
                {conditionOptions.map(option => (
                  <div key={option.value} className={`condition-option ${formData.tradeCondition === option.value ? 'active' : ''}`}>
                    <span className="condition-value">{option.value}</span>
                    <span className="condition-label">{option.label}</span>
                    <span className="condition-desc">{option.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="condition-flags">
            <label>Additional Notes</label>
            <div className="flag-grid">
              {conditionFlags.map(flag => (
                <label key={flag.id} className="flag-item">
                  <input
                    type="checkbox"
                    checked={formData.tradeConditionNotes.includes(flag.id)}
                    onChange={() => handleTradeConditionFlagToggle(flag.id)}
                  />
                  <span>{flag.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="photo-upload">
            <label>Trade-in Photos (Optional)</label>
            <PhotoUploader
              photos={formData.tradePhotos}
              onAdd={handleTradePhotoAdd}
              onRemove={handleTradePhotoRemove}
              maxPhotos={5}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tradeNotes">Trade-in Notes (Optional)</label>
            <textarea
              id="tradeNotes"
              value={formData.tradeNotes}
              onChange={(e) => handleInputChange('tradeNotes', e.target.value)}
              placeholder="Any additional notes about your trade-in vehicle..."
              rows="3"
            />
          </div>
        </>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="create-deal-step">
      <h2>Price Estimate</h2>
      {priceLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ 
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>
            Analyzing regional market data...
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Checking AutoTrader, Cars.com, and other sources
          </p>
        </div>
      ) : priceRange ? (
        <div className="price-estimate">
          <PriceRange price={priceRange} />
          <div className="price-explanation">
            <p>{priceRange.explanation}</p>
            {priceRange.isRealData && (
              <div style={{ 
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}>
                <p style={{ color: '#0369a1', margin: 0 }}>
                  <strong>✅ Real Market Data:</strong> Based on {priceRange.count} actual listings from {priceRange.source}
                </p>
                {priceRange.region && (
                  <p style={{ color: '#0369a1', margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>
                    📍 {priceRange.region.charAt(0).toUpperCase() + priceRange.region.slice(1)} region pricing
                    {priceRange.confidence && ` • ${Math.round(priceRange.confidence * 100)}% confidence`}
                  </p>
                )}
              </div>
            )}
            
            {/* Pricing Disclaimer */}
            <div style={{ 
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}>
              <p style={{ color: '#92400e', margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                ⚠️ Important Pricing Notes:
              </p>
              <ul style={{ color: '#92400e', margin: 0, paddingLeft: '1rem' }}>
                <li style={{ marginBottom: '0.25rem' }}>
                  These prices are <strong>retail market averages</strong> - what cars sell for to consumers, not wholesale/auction prices
                </li>
                <li style={{ marginBottom: '0.25rem' }}>
                  <strong>Pro Tip:</strong> Get a quote from your local CarMax - most major manufacturers honor CarMax quotes for trade-ins
                </li>
                <li>
                  Prices can vary significantly based on condition, location, and market demand
                </li>
              </ul>
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <button 
                  onClick={() => {
                    const zipCode = formData.zipCode || '90210'
                    window.open(`https://www.carmax.com/cars?zip=${zipCode}`, '_blank')
                  }}
                  style={{
                    background: '#059669',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  🔍 Find Nearest CarMax for Quote
                </button>
              </div>
            </div>
            {!priceRange.isRealData && (
              <div style={{ 
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}>
                <p style={{ color: '#92400e', margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                  <strong>⚠️ Estimated Pricing:</strong> Using algorithm pricing (no market data available)
                </p>
                <p style={{ color: '#92400e', margin: '0 0 0.5rem 0' }}>
                  <strong>Pro Tip:</strong> Get a real quote from your local CarMax for the most accurate pricing
                </p>
                <div style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => {
                      const zipCode = formData.zipCode || '90210'
                      window.open(`https://www.carmax.com/cars?zip=${zipCode}`, '_blank')
                    }}
                    style={{
                      background: '#059669',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    🔍 Get CarMax Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#6b7280' }}>Unable to calculate pricing</p>
        </div>
      )}
    </div>
  )

  const renderStep5 = () => (
    <div className="create-deal-step">
      <h2>Review Your Deal</h2>
      <div className="deal-summary">
        <div className="summary-section">
          <h3>Vehicle You Want to Buy</h3>
          <p>{formData.year} {formData.make} {formData.model} {formData.trim}</p>
          <p>{formData.mileage.toLocaleString()} miles</p>
          <p><strong>Type:</strong> {formData.vehicleType === 'new' ? 'New Car' : 'Used Car'}</p>
          {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
        </div>
        {formData.vehicleType === 'used' && (
          <div className="summary-section">
            <h3>Condition</h3>
            <p>Rating: {formData.condition}/5</p>
            {formData.conditionNotes.length > 0 && (
              <p>Notes: {formData.conditionNotes.join(', ')}</p>
            )}
          </div>
        )}
        {formData.hasTradeIn && (
          <div className="summary-section">
            <h3>Trade-In Vehicle</h3>
            <p>{formData.tradeYear} {formData.tradeMake} {formData.tradeModel} {formData.tradeTrim}</p>
            <p>{formData.tradeMileage.toLocaleString()} miles</p>
            <p><strong>Condition:</strong> {formData.tradeCondition}/5</p>
            {formData.tradeConditionNotes.length > 0 && (
              <p>Notes: {formData.tradeConditionNotes.join(', ')}</p>
            )}
          </div>
        )}
        <div className="summary-section">
          <h3>Price Range</h3>
          <PriceRange price={priceRange} />
        </div>
        {formData.notes && (
          <div className="summary-section">
            <h3>Notes</h3>
            <p>{formData.notes}</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      case 5: return renderStep5()
      default: return renderStep1()
    }
  }

  return (
    <div className="mobile-first-create-deal">
      <div className="container">
        <div className="mobile-first-header">
          <h1 className="mobile-first-title text-center">Create New Deal</h1>
          <ProgressDots current={currentStep} total={5} steps={steps} />
        </div>

        <div className="mobile-first-step">
          {renderCurrentStep()}
        </div>

        <div className="mobile-first-navigation">
          {currentStep > 1 && (
            <button className="btn btn-secondary" onClick={handlePrevious}>
              ← Previous
            </button>
          )}
          {currentStep < 5 ? (
            <button 
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
            >
              Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSave}>
              Save Deal
            </button>
          )}
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateDeal