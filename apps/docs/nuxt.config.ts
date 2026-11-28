import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/color-mode',
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { name: "author", content: "Dawit (@oneminch)" },
        { name: "robots", content: "index, follow" }
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg"
        }
      ]
    }
  },
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
