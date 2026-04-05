// Client-side service worker update handler
// - prompt user to reload only when online
// - if offline, wait for 'online' event then prompt

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
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

    // If there's already a waiting SW, prompt (subject to online check)
    if (registration.waiting) {
      handleUpdate(registration)
    }

    // Watch for new SW install
    registration.addEventListener('updatefound', () => {
      const newSW = registration.installing
      if (!newSW) return
      newSW.addEventListener('statechange', () => {
        if (newSW.state === 'installed' && registration.waiting) {
          handleUpdate(registration)
        }
      })
    })

    // When controller changes (new SW took control), reload only if online
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
}
