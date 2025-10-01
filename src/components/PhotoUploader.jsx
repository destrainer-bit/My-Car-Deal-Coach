import React, { useRef, useState } from 'react'
import { compressImage, needsCompression, formatFileSize } from '../lib/imageUtils.js'
import LazyImage from './LazyImage.jsx'

function PhotoUploader({ photos, onAdd, onRemove, maxPhotos = 5, compact = false }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files)
    setUploading(true)
    
    try {
      for (const file of files) {
        if (photos.length >= maxPhotos) {
          alert(`Maximum ${maxPhotos} photos allowed`)
          break
        }

        if (!file.type.startsWith('image/')) {
          alert('Please select image files only')
          continue
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          alert('File size must be less than 10MB')
          continue
        }

        // Check if compression is needed
        if (needsCompression(file, 500)) { // 500KB threshold
          console.log(`Compressing ${file.name} (${formatFileSize(file.size)})`)
          const compressedBlob = await compressImage(file, 800, 600, 0.8)
          const reader = new FileReader()
          reader.onload = (e) => {
            onAdd(e.target.result)
          }
          reader.readAsDataURL(compressedBlob)
        } else {
          // Use original file
          const reader = new FileReader()
          reader.onload = (e) => {
            onAdd(e.target.result)
          }
          reader.readAsDataURL(file)
        }
      }
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Error processing images. Please try again.')
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const renderPhotoGrid = () => (
    <div className={`photo-grid ${compact ? 'compact' : ''}`}>
      {photos.map((photo, index) => (
        <div key={index} className="photo-item">
          <div className="photo-preview">
            <LazyImage 
              src={photo} 
              alt={`Upload ${index + 1}`}
              className="photo-image"
            />
            <button 
              className="photo-remove"
              onClick={() => onRemove(index)}
              title="Remove photo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
      
      {photos.length < maxPhotos && (
        <div className="photo-add" onClick={handleAddClick}>
          <div className="photo-add-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Add Photo</span>
          </div>
        </div>
      )}
    </div>
  )

  const renderCompactUploader = () => (
    <div className="photo-uploader-compact">
      <button 
        className="btn btn-secondary btn-small"
        onClick={handleAddClick}
        disabled={photos.length >= maxPhotos}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Add Photo ({photos.length}/{maxPhotos})
      </button>
    </div>
  )

  return (
    <div className="photo-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {compact ? renderCompactUploader() : (
        <div className="photo-uploader-full">
          <div className="photo-uploader-header">
            <label>Photos ({photos.length}/{maxPhotos})</label>
            <button 
              className="btn btn-secondary btn-small"
              onClick={handleAddClick}
              disabled={photos.length >= maxPhotos || uploading}
            >
              {uploading ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 12 12;360 12 12"/>
                  </path>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {uploading ? 'Processing...' : 'Add Photos'}
            </button>
          </div>
          
          {photos.length > 0 ? renderPhotoGrid() : (
            <div className="photo-uploader-empty">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <p>No photos yet. Click "Add Photos" to get started.</p>
              <button 
                className="btn btn-primary"
                onClick={handleAddClick}
              >
                Add Your First Photo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PhotoUploader