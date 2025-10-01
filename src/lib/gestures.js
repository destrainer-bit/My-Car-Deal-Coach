// Mobile gesture utilities
import { useState, useRef } from 'react'

/**
 * Hook for swipe gesture detection
 * @param {Function} onSwipeLeft - Callback for left swipe
 * @param {Function} onSwipeRight - Callback for right swipe
 * @param {Function} onSwipeUp - Callback for up swipe
 * @param {Function} onSwipeDown - Callback for down swipe
 * @param {number} minSwipeDistance - Minimum distance for swipe detection
 * @returns {Object} - Touch event handlers
 */
export const useSwipeGesture = (
  onSwipeLeft = null,
  onSwipeRight = null,
  onSwipeUp = null,
  onSwipeDown = null,
  minSwipeDistance = 50
) => {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > minSwipeDistance) {
        if (deltaX > 0) {
          onSwipeLeft?.()
        } else {
          onSwipeRight?.()
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > minSwipeDistance) {
        if (deltaY > 0) {
          onSwipeUp?.()
        } else {
          onSwipeDown?.()
        }
      }
    }
  }

  return { onTouchStart, onTouchMove, onTouchEnd }
}

/**
 * Hook for pull-to-refresh functionality
 * @param {Function} onRefresh - Callback when refresh is triggered
 * @param {number} pullDistance - Distance to pull before triggering refresh
 * @returns {Object} - Touch event handlers and refresh state
 */
export const usePullToRefresh = (onRefresh, pullDistance = 100) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullStart, setPullStart] = useState(null)
  const [pullCurrent, setPullCurrent] = useState(0)

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setPullStart(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && pullStart) {
      const currentY = e.touches[0].clientY
      const distance = currentY - pullStart
      
      if (distance > 0) {
        setPullCurrent(distance)
        e.preventDefault() // Prevent scrolling
      }
    }
  }

  const handleTouchEnd = () => {
    if (pullCurrent > pullDistance && !isRefreshing) {
      setIsRefreshing(true)
      onRefresh()
      setTimeout(() => {
        setIsRefreshing(false)
        setPullCurrent(0)
      }, 1000)
    } else {
      setPullCurrent(0)
    }
    setPullStart(null)
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isRefreshing,
    pullProgress: Math.min(pullCurrent / pullDistance, 1)
  }
}

/**
 * Haptic feedback utility
 * @param {string} type - Type of haptic feedback ('light', 'medium', 'heavy', 'success', 'warning', 'error')
 */
export const triggerHaptic = (type = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      warning: [20, 50, 20],
      error: [30, 100, 30]
    }
    
    navigator.vibrate(patterns[type] || patterns.light)
  }
}

/**
 * Hook for long press detection
 * @param {Function} onLongPress - Callback for long press
 * @param {number} delay - Delay in milliseconds for long press
 * @returns {Object} - Touch event handlers
 */
export const useLongPress = (onLongPress, delay = 500) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const timeoutRef = useRef(null)

  const start = (e) => {
    setLongPressTriggered(false)
    timeoutRef.current = setTimeout(() => {
      setLongPressTriggered(true)
      onLongPress?.(e)
      triggerHaptic('medium')
    }, delay)
  }

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const onTouchStart = (e) => {
    start(e)
  }

  const onTouchEnd = () => {
    clear()
  }

  const onTouchMove = () => {
    clear()
  }

  return {
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    longPressTriggered
  }
}

/**
 * Hook for pinch-to-zoom detection
 * @param {Function} onPinch - Callback for pinch gesture
 * @returns {Object} - Touch event handlers
 */
export const usePinchGesture = (onPinch) => {
  const [initialDistance, setInitialDistance] = useState(null)

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      setInitialDistance(getDistance(e.touches))
    }
  }

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance) {
      const currentDistance = getDistance(e.touches)
      const scale = currentDistance / initialDistance
      onPinch?.(scale)
    }
  }

  const onTouchEnd = () => {
    setInitialDistance(null)
  }

  return { onTouchStart, onTouchMove, onTouchEnd }
}
