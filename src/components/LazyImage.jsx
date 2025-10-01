import React, { useState, useRef, useEffect } from 'react'

/**
 * Lazy loading image component with intersection observer
 */
function LazyImage({ 
  src, 
  alt, 
  placeholder = '/placeholder.jpg', 
  className = '', 
  style = {},
  onLoad,
  onError,
  ...props 
}) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before image comes into view
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    onError?.()
  }

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={style}
    >
      {inView && (
        <img
          {...props}
          src={error ? placeholder : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          className={`lazy-image ${loaded ? 'loaded' : 'loading'}`}
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            ...style
          }}
        />
      )}
      {!inView && (
        <div 
          className="lazy-image-placeholder"
          style={{
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '14px',
            ...style
          }}
        >
          Loading...
        </div>
      )}
    </div>
  )
}

export default LazyImage
