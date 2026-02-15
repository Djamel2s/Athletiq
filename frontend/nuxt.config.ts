// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon'
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Athletiq - Suivi intelligent d\'entraînements',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Application de suivi d\'entraînements de musculation' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/athletiq-icon.svg' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    }
  }
})
