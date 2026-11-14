import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('falls back to the error handler when no method is configured', async () => {
    const res = await $fetch<{ status: string }>('/api/submit-feedback', {
      method: 'POST',
      body: {},
    })
    expect(res.status).toBe('failure')
  })
})
