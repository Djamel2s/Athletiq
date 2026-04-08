// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  // Icon module config: use a local endpoint that does NOT collide with backend `/api`
  icon: {
    provider: 'server',
    localApiEndpoint: '/_nuxt_icon'
  },

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
      ],
      // Vercel Speed Insights removed - loaded automatically by Vercel platform when deployed.
      // If needed, use the @vercel/speed-insights npm package instead for proper SRI support.
      script: []
    }
  },

  // PWA module removed to avoid known workbox vulnerabilities; re-add with compatible plugin/version when ready

  devServer: {
    host: '0.0.0.0'
  },

  // Nitro dev proxy: forward `/api` to local backend during development
  nitro: {
    devProxy: {
      '/api': 'http://localhost:3001'
    }
  },

  // Vite dev server proxy: forward browser requests during development
  vite: {
    server: {
      proxy: {
        '/api': 'http://localhost:3001'
      }
    }
  },

  runtimeConfig: {
    public: {
      // In dev we proxy `/api` to the backend; use the proxied path as default.
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '/api'
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

  routeRules: {
    '/**': {
      headers: (() => {
        const baseHeaders: Record<string, string> = {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '0',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }

        // Keep a strict CSP; development traffic to the local API is proxied via Nitro
        const csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://*.athletiq.fr wss://*.athletiq.fr https://*.stripe.com; frame-src https://*.stripe.com; object-src 'none'; base-uri 'self'"

        return {
          ...baseHeaders,
          'Content-Security-Policy': csp
        }
      })()
    },
    '/dashboard/**': { ssr: false },
    '/workouts/**': { ssr: false },
    '/workouts/session': { ssr: false },
    '/settings': { ssr: false },
    '/profile': { ssr: false },
    '/profile/**': { ssr: false },
    '/edit-profile': { ssr: false },
    '/feed': { ssr: false },
    '/friends': { ssr: false },
    '/body': { ssr: false },
    '/statistics': { ssr: false },
    '/calendar': { ssr: false },
    '/streak': { ssr: false },
    '/wrapped': { ssr: false },
    '/subscription/**': { ssr: false },
    '/login': { ssr: false },
    '/register': { ssr: false },
    '/forgot-password': { ssr: false },
    '/reset-password': { ssr: false },
    '/programs': { ssr: false },
    '/achievements': { ssr: false },
    '/onboarding': { ssr: false },
    '/shared/**': { ssr: false },
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
