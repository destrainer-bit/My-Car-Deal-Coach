import React, { useState } from 'react'
import { estimatePriceRange } from '../lib/pricing.js'
import { validateDealData } from '../lib/validators.js'
import ProgressDots from '../components/ProgressDots.jsx'
import PhotoUploader from '../components/PhotoUploader.jsx'
import PriceRange from '../components/PriceRange.jsx'

function CreateDeal({ onSave, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
    mileage: '',
    zipCode: '',
    condition: 3,
    conditionNotes: [],
    photos: [],
    notes: ''
  })

  const steps = [
    { title: 'Vehicle Basics', description: 'Tell us about your car' },
    { title: 'Condition', description: 'Rate the condition' },
    { title: 'Price Estimate', description: 'See your price range' },
    { title: 'Summary', description: 'Review and save' }
  ]

  const conditionOptions = [
    { value: 1, label: 'Poor', description: 'Major issues, high mileage' },
    { value: 2, label: 'Fair', description: 'Some wear, minor issues' },
    { value: 3, label: 'Good', description: 'Normal wear, well maintained' },
    { value: 4, label: 'Very Good', description: 'Minimal wear, excellent condition' },
    { value: 5, label: 'Excellent', description: 'Like new, perfect condition' }
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

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.year && formData.make && formData.model && formData.mileage && formData.zipCode
      case 2:
        return true // Condition is always valid
      case 3:
        return true // Price is calculated
      case 4:
        return true // Summary is always valid
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
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

  const priceRange = estimatePriceRange(formData)

  const renderStep1 = () => (
    <div className="create-deal-step">
      <h2>Vehicle Information</h2>
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
      <h2>Vehicle Condition</h2>
      <div className="condition-rating">
        <label>Overall Condition</label>
        <div className="condition-slider">
          <input
            type="range"
            min="1"
            max="5"
            value={formData.condition}
            onChange={(e) => handleInputChange('condition', parseInt(e.target.value))}
            className="slider"
          />
          <div className="condition-labels">
            {conditionOptions.map(option => (
              <div key={option.value} className={`condition-option ${formData.condition === option.value ? 'active' : ''}`}>
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
                checked={formData.conditionNotes.includes(flag.id)}
                onChange={() => handleConditionFlagToggle(flag.id)}
              />
              <span>{flag.label}</span>
            </label>
          ))}
        </div>
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
      <h2>Price Estimate</h2>
      <div className="price-estimate">
        <PriceRange price={priceRange} />
        <div className="price-explanation">
          <p>{priceRange.explanation}</p>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="create-deal-step">
      <h2>Review Your Deal</h2>
      <div className="deal-summary">
        <div className="summary-section">
          <h3>Vehicle</h3>
          <p>{formData.year} {formData.make} {formData.model} {formData.trim}</p>
          <p>{formData.mileage.toLocaleString()} miles</p>
        </div>
        <div className="summary-section">
          <h3>Condition</h3>
          <p>Rating: {formData.condition}/5</p>
          {formData.conditionNotes.length > 0 && (
            <p>Notes: {formData.conditionNotes.join(', ')}</p>
          )}
        </div>
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
      default: return renderStep1()
    }
  }

  return (
    <div className="create-deal">
      <div className="create-deal-header">
        <h1>Create New Deal</h1>
        <ProgressDots current={currentStep} total={4} steps={steps} />
      </div>

      <div className="create-deal-content">
        {renderCurrentStep()}
      </div>

      <div className="create-deal-actions">
        {currentStep > 1 && (
          <button className="btn btn-secondary" onClick={handlePrevious}>
            Previous
          </button>
        )}
        {currentStep < 4 ? (
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isStepValid(currentStep)}
          >
            Next
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
  )
}

export default CreateDeal