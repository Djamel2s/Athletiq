import { Capacitor } from '@capacitor/core'

export default defineNuxtPlugin(async () => {
  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) return

  const { PushNotifications } = await import('@capacitor/push-notifications')
  const { useFcmTokenApi } = await import('~/composables/useFcmTokenApi')
  const { useToast } = await import('~/composables/useToast')

  const { registerToken } = useFcmTokenApi()
  const toast = useToast()

  // Check if push is enabled by user preference
  const pushEnabled = localStorage.getItem('pushEnabled')
  if (pushEnabled === 'false') return

  // Request permission
  const permResult = await PushNotifications.requestPermissions()
  if (permResult.receive !== 'granted') return

  // Register for push notifications
  await PushNotifications.register()

  // On registration success, send token to backend
  PushNotifications.addListener('registration', async (token) => {
    try {
      const platform = Capacitor.getPlatform() // 'android' | 'ios'
      await registerToken(token.value, platform)
      localStorage.setItem('fcmToken', token.value)
    } catch (error) {
      console.error('Failed to register FCM token:', error)
    }
  })

  // On registration error
  PushNotifications.addListener('registrationError', (error) => {
    console.error('Push registration error:', error)
  })

  // On push received in foreground
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    toast.info(
      notification.title || 'Notification',
      notification.body || ''
    )
  })

  // On push notification tapped
  PushNotifications.addListener('pushNotificationActionPerformed', () => {
    navigateTo('/dashboard')
  })
})
