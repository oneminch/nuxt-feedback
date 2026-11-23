import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('module (no method configured)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('falls back to the error handler for POST /api/_nuxt-feedback/submit', async () => {
    const res = await $fetch<{ error: boolean, status: string }>(
      '/api/_nuxt-feedback/submit',
      { method: 'POST', body: {} },
    )
    expect(res).toMatchObject({ error: true, status: 'failure' })
  })
})
