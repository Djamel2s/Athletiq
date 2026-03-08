import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.athletiq.mobile',
  appName: 'Athletiq',
  webDir: '.output/public',
  server: {
    // En développement, pointe vers le serveur Nuxt local
    // Commenter cette ligne pour le build production
    // url: 'http://192.168.1.X:3000',
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#f5f0eb',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      splashFullScreen: false,
      splashImmersive: false
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#f5f0eb'
    }
  }
}

export default config
