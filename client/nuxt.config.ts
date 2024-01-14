// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-icon', '@nuxt/ui'],
  devtools: { enabled: true },
  build: {
    transpile: ['@heroicons/vue']
  },
  css: ['~/assets/css/main.css', 'bootstrap/dist/css/bootstrap.css',],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  components: [
    {
      path: '~/components',
    }
  ]
})
