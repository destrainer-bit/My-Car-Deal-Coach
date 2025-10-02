// Native camera integration for Car Deal Coach
import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export async function takePhoto() {
  if (Capacitor.isNativePlatform()) {
    try {
      const img = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 85
      })
      return { dataUrl: img.dataUrl }
    } catch (error) {
      console.error('Camera error:', error)
      return { error: error.message }
    }
  } else {
    // Web fallback: use input[type=file]
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) return resolve({})
        const reader = new FileReader()
        reader.onload = () => resolve({ dataUrl: reader.result })
        reader.readAsDataURL(file)
      }
      input.click()
    })
  }
}

export async function selectFromGallery() {
  if (Capacitor.isNativePlatform()) {
    try {
      const img = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        quality: 85
      })
      return { dataUrl: img.dataUrl }
    } catch (error) {
      console.error('Gallery error:', error)
      return { error: error.message }
    }
  } else {
    // Web fallback: use input[type=file]
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = true
      input.onchange = () => {
        const files = Array.from(input.files || [])
        if (files.length === 0) return resolve({})
        
        const reader = new FileReader()
        reader.onload = () => resolve({ dataUrl: reader.result })
        reader.readAsDataURL(files[0])
      }
      input.click()
    })
  }
}





