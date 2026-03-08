// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt'
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Athletiq - Suivi intelligent d\'entraînements',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Athletiq — Ton coach de musculation intelligent. Suis tes entraînements, tes progrès et atteins tes objectifs.' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Athletiq — Suivi intelligent d\'entraînements' },
        { property: 'og:description', content: 'Suis tes entraînements, analyse tes progrès et atteins tes objectifs avec Athletiq.' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:site_name', content: 'Athletiq' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Athletiq — Suivi intelligent d\'entraînements' },
        { name: 'twitter:description', content: 'Suis tes entraînements, analyse tes progrès et atteins tes objectifs.' },
        { name: 'twitter:image', content: '/og-image.png' },
        // Theme
        { name: 'theme-color', content: '#d4c4b0' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/athletiq-icon.svg' },
        { rel: 'apple-touch-icon', href: '/athletiq-icon.svg' }
      ]
    }
  },

  // PWA Configuration
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Athletiq',
      short_name: 'Athletiq',
      description: 'Ton coach de musculation intelligent',
      theme_color: '#d4c4b0',
      background_color: '#f5f0eb',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/dashboard',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      // Cache les pages de l'app
      navigateFallback: '/',
      // Cache les ressources statiques (CSS, JS, images)
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      // Cache les appels API (stratégie network-first = essaie le réseau, sinon cache)
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 24h
            }
          }
        }
      ]
    },
    // Désactivé en dev pour ne pas gêner le hot-reload
    devOptions: {
      enabled: false
    }
  },

  devServer: {
    host: '0.0.0.0'
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    }
  }
})
