// Native polish and quality of life features for Car Deal Coach
import React from 'react'

// Temporarily disable native features for browser compatibility
// TODO: Re-enable when building for native platforms

export function useNativePolish() {
  React.useEffect(() => {
    // Native features disabled for browser compatibility
    console.log('Native features disabled in browser environment')
  }, [])
}

export function tapFeedback() {
  // Haptic feedback disabled in browser
  console.log('Tap feedback (browser mode)')
}

export function successFeedback() {
  // Haptic feedback disabled in browser
  console.log('Success feedback (browser mode)')
}

export function errorFeedback() {
  // Haptic feedback disabled in browser
  console.log('Error feedback (browser mode)')
}

// Initialize native features on app start
export function initializeNativeFeatures() {
  console.log('Native features disabled in browser environment')
}
