import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferred(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, right: 16, padding: 12,
      borderRadius: 12, backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.7)',
      color: 'white', display: 'flex', gap: 12, alignItems: 'center', zIndex: 9999
    }}>
      <div style={{ flex: 1 }}>
        <strong>Install Car Deal Coach?</strong>
        <div style={{ opacity: 0.8, fontSize: 13 }}>Get faster access and offline support.</div>
      </div>
      <button
        onClick={async () => {
          const ev = deferred
          setVisible(false)
          if (!ev) return
          ev.prompt()
          const choice = await ev.userChoice
          // Optional: analytics on choice.outcome === 'accepted'
          setDeferred(null)
        }}
        style={{ padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
      >Install</button>
      <button
        onClick={() => setVisible(false)}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #555', background: 'transparent', color: 'white', cursor: 'pointer' }}
      >Later</button>
    </div>
  )
}



