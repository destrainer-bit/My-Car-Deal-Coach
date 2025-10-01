import React, { useState, useEffect } from 'react'
import { mapsAPI } from '../lib/mapsAPI.js'
import { triggerHaptic } from '../lib/gestures.js'

function DealershipLocator({ isOpen, onClose, vehicleData }) {
  const [loading, setLoading] = useState(false)
  const [dealerships, setDealerships] = useState([])
  const [error, setError] = useState(null)
  const [selectedDealership, setSelectedDealership] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    if (isOpen) {
      getCurrentLocation()
    }
  }, [isOpen])

  const getCurrentLocation = async () => {
    try {
      const location = await mapsAPI.getCurrentLocation()
      setUserLocation(location)
      fetchDealerships(location)
    } catch (err) {
      console.error('Location error:', err)
      // Fallback to ZIP code if available
      if (vehicleData?.zip) {
        const zipLocation = await mapsAPI.zipToCoordinates(vehicleData.zip)
        setUserLocation(zipLocation)
        fetchDealerships(zipLocation)
      } else {
        setError('Unable to get your location. Please enable location services.')
      }
    }
  }

  const fetchDealerships = async (location) => {
    setLoading(true)
    setError(null)
    
    try {
      triggerHaptic('light')
      const data = await mapsAPI.findNearbyDealerships(
        location, 
        vehicleData?.make, 
        25 // 25 mile radius
      )
      setDealerships(data.dealerships)
      triggerHaptic('success')
    } catch (err) {
      setError(err.message)
      triggerHaptic('error')
    } finally {
      setLoading(false)
    }
  }

  const handleDealershipSelect = async (dealership) => {
    try {
      triggerHaptic('light')
      const details = await mapsAPI.getDealershipDetails(dealership.placeId)
      setSelectedDealership({ ...dealership, ...details })
    } catch (err) {
      console.error('Error fetching dealership details:', err)
    }
  }

  const handleGetDirections = async (dealership) => {
    if (!userLocation) return
    
    try {
      triggerHaptic('light')
      const directions = await mapsAPI.getDirections(userLocation, {
        lat: dealership.lat || 0,
        lng: dealership.lng || 0
      })
      
      // In a real app, you would open Google Maps or Apple Maps
      alert(`Directions to ${dealership.name}:\n${directions.steps.join('\n')}\n\nDistance: ${directions.distance}\nTime: ${directions.duration}`)
    } catch (err) {
      console.error('Error getting directions:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content dealership-locator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Find Nearby Dealerships</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 12 12;360 12 12"/>
                  </path>
                </svg>
              </div>
              <p>Finding dealerships near you...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p>Error: {error}</p>
              <button className="btn btn-primary" onClick={getCurrentLocation}>
                Try Again
              </button>
            </div>
          )}

          {dealerships.length > 0 && (
            <div className="dealerships-content">
              <div className="dealerships-list">
                <h3>Nearby Dealerships ({dealerships.length} found)</h3>
                {dealerships.map((dealership, index) => (
                  <div 
                    key={index} 
                    className={`dealership-card ${selectedDealership?.placeId === dealership.placeId ? 'selected' : ''}`}
                    onClick={() => handleDealershipSelect(dealership)}
                  >
                    <div className="dealership-info">
                      <h4>{dealership.name}</h4>
                      <p className="address">{dealership.address}</p>
                      <div className="dealership-meta">
                        <span className="rating">⭐ {dealership.rating || 'N/A'} ({dealership.reviews || 0} reviews)</span>
                        <span className="distance">{dealership.distance}</span>
                        <span className="travel-time">{dealership.estimatedTravelTime}</span>
                      </div>
                      <div className="dealership-brands">
                        {dealership.brands.map((brand, i) => (
                          <span key={i} className="brand-tag">{brand}</span>
                        ))}
                      </div>
                      {dealership.specialOffers.length > 0 && (
                        <div className="special-offers">
                          {dealership.specialOffers.map((offer, i) => (
                            <span key={i} className="offer-tag">{offer}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="dealership-actions">
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGetDirections(dealership)
                        }}
                      >
                        Directions
                      </button>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`tel:${dealership.phone}`)
                        }}
                      >
                        Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedDealership && (
                <div className="dealership-details">
                  <h3>{selectedDealership.name} Details</h3>
                  <div className="details-grid">
                    <div className="detail-section">
                      <h4>Contact Information</h4>
                      <p><strong>Phone:</strong> {selectedDealership.phone}</p>
                      <p><strong>Address:</strong> {selectedDealership.address}</p>
                      {selectedDealership.website && (
                        <p><strong>Website:</strong> <a href={selectedDealership.website} target="_blank" rel="noopener noreferrer">{selectedDealership.website}</a></p>
                      )}
                    </div>

                    <div className="detail-section">
                      <h4>Hours</h4>
                      <div className="hours-list">
                        {Object.entries(selectedDealership.hours).map(([day, hours]) => (
                          <div key={day} className="hours-item">
                            <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                            <span className="hours">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Services</h4>
                      <div className="services-list">
                        {selectedDealership.services.map((service, i) => (
                          <span key={i} className="service-tag">{service}</span>
                        ))}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Brands</h4>
                      <div className="brands-list">
                        {selectedDealership.brands.map((brand, i) => (
                          <span key={i} className="brand-tag">{brand}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {dealerships.length > 0 && (
            <button className="btn btn-primary" onClick={getCurrentLocation}>
              Refresh
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DealershipLocator
