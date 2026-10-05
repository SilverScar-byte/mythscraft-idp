import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true
  },

  modules: [
    '@nuxtjs/supabase'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  // Disable Nuxt component auto-discovery.
  // We will explicitly import our own components.
  components: false,

  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})