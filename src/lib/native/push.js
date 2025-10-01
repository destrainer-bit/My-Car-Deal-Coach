// Native push notifications for Car Deal Coach
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'

export async function enableNativePush() {
  if (!Capacitor.isNativePlatform()) {
    return { ok: false, reason: 'not-native' }
  }

  try {
    let permStatus = await PushNotifications.checkPermissions()
    if (permStatus.receive !== 'granted') {
      permStatus = await PushNotifications.requestPermissions()
      if (permStatus.receive !== 'granted') {
        return { ok: false, reason: 'denied' }
      }
    }

    await PushNotifications.register()

    return new Promise((resolve) => {
      PushNotifications.addListener('registration', async (token) => {
        try {
          // Send token to your backend (store by user_id)
          await fetch('/api/push/register-native', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              platform: Capacitor.getPlatform(), 
              token: token.value || token.token 
            })
          })
          resolve({ ok: true, token: token.value || token.token })
        } catch (error) {
          console.error('Token registration failed:', error)
          resolve({ ok: false, reason: 'registration-failed' })
        }
      })
      
      PushNotifications.addListener('registrationError', (err) => {
        console.error('Push registration error:', err)
        resolve({ ok: false, reason: 'registrationError' })
      })
      
      // Handle foreground notifications
      PushNotifications.addListener('pushNotificationReceived', (notif) => {
        console.log('Push notification received:', notif)
        // You can show a toast or route to specific screen here
      })
      
      // Handle notification taps
      PushNotifications.addListener('pushNotificationActionPerformed', (notif) => {
        console.log('Push notification tapped:', notif)
        // Handle navigation based on notification data
      })
    })
  } catch (error) {
    console.error('Push setup error:', error)
    return { ok: false, reason: 'setup-failed' }
  }
}

// Unified push notification setup (works for both web and native)
export async function enableNotifications() {
  if (Capacitor.isNativePlatform()) {
    return enableNativePush()
  } else {
    // Web push fallback - you can implement this if needed
    return { ok: false, reason: 'web-push-not-implemented' }
  }
}


