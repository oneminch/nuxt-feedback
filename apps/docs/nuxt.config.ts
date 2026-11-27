import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/color-mode',
  ],
  content: {
    build: {
      markdown: {
        highlight: {
          langs: [],
          theme: 'github-dark'
        }
      }
    }
  },
  colorMode: {
    classSuffix: '',
  },
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
