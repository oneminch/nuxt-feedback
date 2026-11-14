import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

const payload = (reaction: string) => ({
  topic: 'General Feedback',
  reaction,
  message: 'hello',
  metadata: {
    route: { fullPath: '/', hash: '', query: {}, name: 'index', path: '/' },
    time: { timestamp: '2024-01-01T00:00:00.000Z', timezone: 'UTC' },
  },
})

describe('module (custom-endpoint)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/custom', import.meta.url)),
  })

  it('registers the <FeedbackWidget /> component', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('Give Feedback')
    expect(html).toContain('feedback-trigger')
  })

  it('registers POST /api/submit-feedback and forwards to the endpoint', async () => {
    const res = await $fetch<{ status: string }>('/api/submit-feedback', {
      method: 'POST',
      body: payload('Love it!'),
    })
    expect(res.status).toBe('success')

    const received = await $fetch<Array<Record<string, unknown>>>('/api/received')
    expect(received).toHaveLength(1)
    expect(received[0]).toMatchObject({ reaction: 'Love it!', siteName: 'E2E Site' })
  })

  it('rejects a submission without a reaction', async () => {
    const res = await $fetch<{ status: string, message: string }>(
      '/api/submit-feedback',
      { method: 'POST', body: payload('') },
    )
    expect(res.status).toBe('failure')
    expect(res.message).toBe('Please select a feedback option.')
  })
})
