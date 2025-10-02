import React, { useState } from 'react'

function WorkingApp() {
  const [currentPage, setCurrentPage] = useState('onboarding')
  const [deals, setDeals] = useState([])

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  const onStart = () => {
    navigateTo('create-deal')
  }

  const onCreateDeal = (deal) => {
    const newDeal = {
      id: Date.now(),
      ...deal,
      createdAt: new Date().toISOString()
    }
    setDeals([...deals, newDeal])
    navigateTo('saved-deals')
  }

  if (currentPage === 'onboarding') {
    return (
      <div className="onboarding">
        <div className="onboarding-header">
          <h1>The Car Deal Coach</h1>
          <p className="tagline">Because An Informed Purchase, Is a Smart Purchase!</p>
          <p>Four Core Benefits of The Car Deal Coach</p>
        </div>

        <div className="onboarding-steps">
          <div className="onboarding-step">
            <h2>Smart Price Estimator</h2>
            <p>A built-in pricing engine that turns your car's details into a clear low, mid, and high range.</p>
          </div>
          <div className="onboarding-step">
            <h2>Saved Deals & Notes Hub</h2>
            <p>Keep all your potential deals, photos, and notes organized in one place.</p>
          </div>
          <div className="onboarding-step">
            <h2>Step-by-Step Negotiation Checklist</h2>
            <p>No more second-guessing. A guided checklist keeps you steady during the deal.</p>
          </div>
          <div className="onboarding-step">
            <h2>The Negotiator – Your Deal-Making Edge</h2>
            <p>A smart coach that preps you for every step of the dealership game.</p>
          </div>
        </div>

        <div className="onboarding-actions">
          <button 
            className="btn btn-primary btn-large"
            onClick={onStart}
          >
            Start a Deal
          </button>
          <p className="onboarding-note">
            Ready to find your next car? Let's get started!
          </p>
        </div>
      </div>
    )
  }

  if (currentPage === 'create-deal') {
    return (
      <div className="create-deal">
        <div className="create-deal-header">
          <h1>Create New Deal</h1>
          <button 
            className="btn btn-secondary"
            onClick={() => navigateTo('onboarding')}
          >
            ← Back
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          const deal = {
            make: formData.get('make'),
            model: formData.get('model'),
            year: formData.get('year'),
            mileage: formData.get('mileage'),
            condition: formData.get('condition'),
            askingPrice: formData.get('askingPrice')
          }
          onCreateDeal(deal)
        }}>
          <div className="form-group">
            <label>Make</label>
            <input type="text" name="make" required />
          </div>
          <div className="form-group">
            <label>Model</label>
            <input type="text" name="model" required />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input type="number" name="year" required />
          </div>
          <div className="form-group">
            <label>Mileage</label>
            <input type="number" name="mileage" required />
          </div>
          <div className="form-group">
            <label>Condition</label>
            <select name="condition" required>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Asking Price</label>
            <input type="number" name="askingPrice" required />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Deal
          </button>
        </form>
      </div>
    )
  }

  if (currentPage === 'saved-deals') {
    return (
      <div className="saved-deals">
        <div className="saved-deals-header">
          <h1>Your Saved Deals</h1>
          <button 
            className="btn btn-primary"
            onClick={() => navigateTo('create-deal')}
          >
            + Add New Deal
          </button>
        </div>

        {deals.length === 0 ? (
          <div className="empty-state">
            <p>No deals saved yet. Create your first deal to get started!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigateTo('create-deal')}
            >
              Create First Deal
            </button>
          </div>
        ) : (
          <div className="deals-list">
            {deals.map(deal => (
              <div key={deal.id} className="deal-card">
                <h3>{deal.year} {deal.make} {deal.model}</h3>
                <p>Mileage: {deal.mileage.toLocaleString()} miles</p>
                <p>Condition: {deal.condition}</p>
                <p>Asking Price: ${deal.askingPrice.toLocaleString()}</p>
                <div className="deal-actions">
                  <button className="btn btn-secondary">Edit</button>
                  <button className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <h1>Page not found</h1>
      <button onClick={() => navigateTo('onboarding')}>Go Home</button>
    </div>
  )
}

export default WorkingApp




