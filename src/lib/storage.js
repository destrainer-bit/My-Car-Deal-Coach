// Storage utilities for Car Deal Coach
const STORAGE_KEYS = {
  DEALS: 'carCoachDeals',
  NOTES: 'carCoachNotes', 
  PHOTOS: 'carCoachPhotos',
  CHECKLIST_PROGRESS: 'carCoachChecklistProgress'
}

export const storage = {
  get: (key) => {
    try {
      if (typeof window === 'undefined') return null
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  },

  set: (key, value) => {
    try {
      if (typeof window === 'undefined') return false
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  },

  remove: (key) => {
    try {
      if (typeof window === 'undefined') return false
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  },

  clear: () => {
    try {
      if (typeof window === 'undefined') return false
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }
}

export const storageKeys = STORAGE_KEYS