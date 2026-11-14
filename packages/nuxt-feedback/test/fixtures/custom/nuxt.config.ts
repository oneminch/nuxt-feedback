import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  feedbackWidget: {
    method: 'custom-endpoint',
    siteName: 'E2E Site',
    customEndpoint: '/api/mock-hook',
  },
})
