import React, { useState, useEffect } from 'react'
import { useHashRoute } from './lib/routing.js'
import { storage, storageKeys } from './lib/storage.js'
import { estimatePriceRange } from './lib/pricing.js'
import { triggerHaptic } from './lib/gestures.js'
import { initializeNativeFeatures } from './lib/native/polish.js'

// Import pages
import Onboarding from './pages/Onboarding.jsx'
import CreateDeal from './pages/CreateDeal.jsx'
import SavedDeals from './pages/SavedDeals.jsx'
import TestSavedDeals from './pages/TestSavedDeals.jsx'
import Checklist from './pages/Checklist.jsx'
import Notes from './pages/Notes.jsx'
import Settings from './pages/Settings.jsx'
import HowToUse from './pages/HowToUse.jsx'
import Legal from './pages/Legal.jsx'

// Import components
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'

function App() {
  const { currentPage, navigateTo } = useHashRoute()
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [deals, setDeals] = useState([])
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [checklistProgress, setChecklistProgress] = useState({})

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedDeals = storage.get(storageKeys.DEALS) || []
        const savedNotes = storage.get(storageKeys.NOTES) || ''
        const savedPhotos = storage.get(storageKeys.PHOTOS) || []
        const savedChecklist = storage.get(storageKeys.CHECKLIST_PROGRESS) || {}
        const savedDarkMode = storage.get(storageKeys.DARK_MODE) || false

        // Check for purchase status
        const purchaseInfo = localStorage.getItem('carDealCoachPurchase')
        if (purchaseInfo) {
          const purchase = JSON.parse(purchaseInfo)
          console.log('User has active purchase:', purchase)
          // You could set a premium state here if needed
        }

        setDeals(savedDeals)
        setNotes(savedNotes)
        setPhotos(savedPhotos)
        setChecklistProgress(savedChecklist)
        setDarkMode(savedDarkMode)

        // Seed with example deals if no deals exist
        if (savedDeals.length === 0) {
          const exampleDeals = [
            {
              id: 'example-1',
              vehicle: {
                year: 2023,
                make: 'Honda',
                model: 'Civic',
                trim: 'EX',
                mileage: 15000,
                zip: '90210',
                condition: 'excellent'
              },
              price: {
                asking: 25000,
                estimated: { low: 22000, mid: 24000, high: 26000 }
              },
              status: 'researching',
              notes: 'One owner, clean CarFax',
              photos: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 'example-2',
              vehicle: {
                year: 2020,
                make: 'Toyota',
                model: 'Camry',
                trim: 'LE',
                mileage: 45000,
                zip: '30309',
                condition: 'good'
              },
              price: {
                asking: 22000,
                estimated: { low: 20000, mid: 22000, high: 24000 }
              },
              status: 'negotiating',
              notes: 'Minor scratches on bumper',
              photos: [],
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
          setDeals(exampleDeals)
          storage.set(storageKeys.DEALS, exampleDeals)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const onUpdateDeal = (updatedDeal) => {
    setDeals(prev => prev.map(deal => 
      deal.id === updatedDeal.id ? updatedDeal : deal
    ))
    storage.set(storageKeys.DEALS, deals)
  }

  const onAddPhoto = (dealId, photo) => {
    const updatedPhotos = [...photos, { ...photo, dealId }]
    setPhotos(updatedPhotos)
    storage.set(storageKeys.PHOTOS, updatedPhotos)
  }

  const onAddNote = (dealId, note) => {
    // This function is for deal-specific notes, not the general notes page
    // For now, we'll just store it in the deal itself
    console.log('Adding note to deal:', dealId, note)
  }

  const onNotesChange = (newNotes) => {
    setNotes(newNotes)
    storage.set(storageKeys.NOTES, newNotes)
  }

  const onUpdateChecklistProgress = (progress) => {
    setChecklistProgress(progress)
    storage.set(storageKeys.CHECKLIST_PROGRESS, progress)
  }

  const onToggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    storage.set(storageKeys.DARK_MODE, newDarkMode)
  }

  const onClearData = () => {
    storage.clear()
    setDeals([])
    setNotes('')
    setPhotos([])
    setChecklistProgress({})
  }

  const onExportData = () => {
    const data = {
      deals,
      notes,
      photos,
      checklistProgress,
      darkMode
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'car-deal-coach-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Car Deal Coach...</p>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'onboarding':
        return <Onboarding onStart={() => navigateTo('create')} />
      case 'create':
        return (
          <CreateDeal 
            onSave={(deal) => {
              const newDeals = [...deals, deal]
              setDeals(newDeals)
              storage.set(storageKeys.DEALS, newDeals)
              navigateTo('deals')
            }}
            onCancel={() => navigateTo('deals')}
          />
        )
      case 'deals':
        return (
          <SavedDeals 
            deals={deals}
            setDeals={setDeals}
            navigateTo={navigateTo}
            onUpdateDeal={onUpdateDeal}
            onAddPhoto={onAddPhoto}
            onAddNote={onAddNote}
            onUpdateChecklistProgress={onUpdateChecklistProgress}
            checklistProgress={checklistProgress}
          />
        )
      case 'checklist':
        return (
          <Checklist 
            deals={deals}
            progress={checklistProgress}
            onUpdate={onUpdateChecklistProgress}
            onBack={() => navigateTo('deals')}
          />
        )
      case 'notes':
        return (
          <Notes 
            notes={notes}
            photos={photos}
            onNotesChange={onNotesChange}
            onPhotosChange={setPhotos}
            onBack={() => navigateTo('deals')}
          />
        )
      case 'settings':
        return (
          <Settings 
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
            onClearData={onClearData}
            onExportData={onExportData}
            deals={deals}
            notes={notes}
            photos={photos}
            navigateTo={navigateTo}
          />
        )
      case 'how-to-use':
        return (
          <HowToUse 
            onBack={() => navigateTo('settings')}
          />
        )
      case 'legal':
        return (
          <Legal 
            onBack={() => navigateTo('settings')}
          />
        )
      default:
        return <Onboarding onStart={() => navigateTo('create')} />
    }
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Header 
        currentPage={currentPage}
        onNavigate={navigateTo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App