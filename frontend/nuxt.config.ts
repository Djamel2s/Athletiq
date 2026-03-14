// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@vercel/speed-insights/nuxt'
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Athletiq - Suis ta progression. Prouve-le.',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'L\'app de musculation qui transforme tes entraînements en résultats. Suivi des séances, progression visuelle, streak et insights personnalisés.' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Athletiq - Suis ta progression. Prouve-le.' },
        { property: 'og:description', content: 'L\'app de musculation qui transforme tes entraînements en résultats. Suivi des séances, progression visuelle, streak et insights personnalisés.' },
        { property: 'og:image', content: 'https://athletiq.fr/athletiq-og.png' },
        { property: 'og:site_name', content: 'Athletiq' },
        { property: 'og:url', content: 'https://athletiq.fr' },
        { property: 'og:locale', content: 'fr_FR' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Athletiq - Suis ta progression. Prouve-le.' },
        { name: 'twitter:description', content: 'L\'app de musculation qui transforme tes entraînements en résultats. Suivi des séances, progression visuelle, streak et insights personnalisés.' },
        { name: 'twitter:image', content: 'https://athletiq.fr/athletiq-og.png' },
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
      // Pas de navigateFallback car SSR (les pages sont servies par le serveur)
      navigateFallback: undefined,
      // Cache les ressources statiques (CSS, JS, images)
      globPatterns: ['**/*.{js,css,png,svg,ico,woff2}'],
      // Strategies runtime
      runtimeCaching: [
        {
          // Pages HTML — network first, fallback sur cache
          urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 // 24h
            }
          }
        },
        {
          // Appels API
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
  },

  sitemap: {
    siteUrl: 'https://athletiq.fr',
    urls: [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/legal/cgu',
      '/legal/privacy',
      '/legal/mentions'
    ],
    exclude: ['/**'],
  },

  robots: {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/workouts',
          '/settings',
          '/profile',
          '/body',
          '/statistics',
          '/calendar',
          '/streak',
          '/wrapped',
          '/subscription',
          '/api'
        ]
      }
    ]
  }
})
