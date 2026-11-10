export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },

  modules: ["@minch/nuxt-feedback", "@nuxt/eslint"],

  // css: ["~/assets/css/main.css"],

  feedbackWidget: {
    method: "custom-endpoint",
    customEndpoint: "/api/feedback/custom-feedback",
    siteName: "Playground",
  },

  compatibilityDate: "2025-05-19",

  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,
    resendFrom: process.env.RESEND_FROM_EMAIL,
    resendTo: process.env.RESEND_TO_EMAIL,
    githubToken: process.env.GITHUB_TOKEN,
    githubRepo: process.env.GITHUB_REPO,
    githubOwner: process.env.GITHUB_OWNER,
  },
});
