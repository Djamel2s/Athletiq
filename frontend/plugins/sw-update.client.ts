import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  const handleUpdate = (registration: ServiceWorkerRegistration) => {
    const promptUser = () => {
      try {
        const ok = confirm('Nouvelle version disponible — recharger maintenant ?')
        if (ok && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      } catch (e) {
        // ignore
      }
    }

    if (navigator.onLine) {
      promptUser()
    } else {
      const onOnline = () => {
        window.removeEventListener('online', onOnline)
        promptUser()
      }
      window.addEventListener('online', onOnline)
    }
  }

  navigator.serviceWorker.getRegistration().then(registration => {
    if (!registration) return

    if (registration.waiting) {
      handleUpdate(registration)
    }

    registration.addEventListener('updatefound', () => {
      const newSW = registration.installing
      if (!newSW) return
      newSW.addEventListener('statechange', () => {
        if (newSW.state === 'installed' && registration.waiting) {
          handleUpdate(registration)
        }
      })
    })

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (navigator.onLine) {
        try {
          window.location.reload()
        } catch (e) {
          // ignore
        }
      }
    })
  }).catch(() => {})
})
