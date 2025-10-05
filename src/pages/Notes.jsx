import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PhotoUploader from '../components/PhotoUploader.jsx'

function Notes({ notes, photos, onNotesChange, onPhotosChange, onBack }) {
  const navigate = useNavigate()
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [editingPhoto, setEditingPhoto] = useState(null)
  
  // Handle notes as string (convert from array if needed)
  const notesText = Array.isArray(notes) ? notes.join('\n') : (notes || '')
  
  const handleNotesChange = (newNotes) => {
    onNotesChange(newNotes)
  }

  const handlePhotoAdd = (photoDataUrl) => {
    const newPhotos = [...photos, {
      id: Date.now().toString(),
      dataUrl: photoDataUrl,
      name: `Photo ${photos.length + 1}`,
      addedAt: new Date().toISOString()
    }]
    onPhotosChange(newPhotos)
  }

  const handlePhotoRemove = (photoId) => {
    const newPhotos = photos.filter(photo => photo.id !== photoId)
    onPhotosChange(newPhotos)
    if (selectedPhoto === photoId) {
      setSelectedPhoto(null)
    }
  }

  const handlePhotoRename = (photoId, newName) => {
    const newPhotos = photos.map(photo => 
      photo.id === photoId ? { ...photo, name: newName } : photo
    )
    onPhotosChange(newPhotos)
    setEditingPhoto(null)
  }

  const openPhotoLightbox = (photoId) => {
    setSelectedPhoto(photoId)
  }

  const closePhotoLightbox = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto)
    const nextIndex = (currentIndex + 1) % photos.length
    setSelectedPhoto(photos[nextIndex].id)
  }

  const prevPhoto = () => {
    const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto)
    const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
    setSelectedPhoto(photos[prevIndex].id)
  }

  const renderPhotoGrid = () => (
    <div className="photos-section">
      <div className="photos-header">
        <h3>Photos ({photos.length}/5)</h3>
        {photos.length < 5 && (
          <PhotoUploader
            photos={photos.map(p => p.dataUrl)}
            onAdd={handlePhotoAdd}
            onRemove={() => {}}
            maxPhotos={5}
            compact={true}
          />
        )}
      </div>
      
      {photos.length > 0 ? (
        <div className="photos-grid">
          {photos.map(photo => (
            <div key={photo.id} className="photo-item">
              <div 
                className="photo-thumbnail"
                onClick={() => openPhotoLightbox(photo.id)}
              >
                <img src={photo.dataUrl} alt={photo.name} />
                <div className="photo-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <div className="photo-info">
                {editingPhoto === photo.id ? (
                  <input
                    type="text"
                    value={photo.name}
                    onChange={(e) => {
                      const newPhotos = photos.map(p => 
                        p.id === photo.id ? { ...p, name: e.target.value } : p
                      )
                      onPhotosChange(newPhotos)
                    }}
                    onBlur={() => setEditingPhoto(null)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setEditingPhoto(null)
                      }
                    }}
                    className="photo-name-input"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="photo-name"
                    onClick={() => setEditingPhoto(photo.id)}
                  >
                    {photo.name}
                  </span>
                )}
                <button 
                  className="photo-delete"
                  onClick={() => handlePhotoRemove(photo.id)}
                  title="Delete photo"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="photos-empty">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <p>No photos yet. Add some photos to keep track of important details.</p>
        </div>
      )}
    </div>
  )

  const renderPhotoLightbox = () => {
    if (!selectedPhoto) return null

    const photo = photos.find(p => p.id === selectedPhoto)
    if (!photo) return null

    return (
      <div className="photo-lightbox" onClick={closePhotoLightbox}>
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          <button className="lightbox-close" onClick={closePhotoLightbox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {photos.length > 1 && (
            <>
              <button className="lightbox-prev" onClick={prevPhoto}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="lightbox-next" onClick={nextPhoto}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
          
          <div className="lightbox-image">
            <img src={photo.dataUrl} alt={photo.name} />
          </div>
          
          <div className="lightbox-info">
            <h3>{photo.name}</h3>
            <p>Added {new Date(photo.addedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-first-notes">
      <div className="mobile-first-notes-container">
      <div className="notes-header">
        <h1>Notes & Photos</h1>
        <p>Keep track of important information and photos for your car search.</p>
        <div className="notes-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/app/saved-deals')}>
            ← Back to Deals
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/app')}>
            🏠 Back to Main
          </button>
        </div>
      </div>

      <div className="notes-content">
        <div className="notes-section">
          <label htmlFor="notes">Your Notes</label>
          <textarea
            id="notes"
            value={notesText}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write down important details, questions, or reminders about your car search..."
            className="notes-textarea"
            rows="8"
          />
          <div className="notes-stats">
            <span>{notesText.length} characters</span>
            <span>{notesText.split('\n').length} lines</span>
          </div>
        </div>

        {renderPhotoGrid()}
      </div>

      {renderPhotoLightbox()}
      </div>
    </div>
  )
}

export default Notes