import { dirname, join } from 'node:path'
import { describe, it, expect, beforeAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe('ssr', async () => {
  beforeAll(async () => {
    await setup({
      rootDir: join(__dirname, '/fixture/basic'),
    })
  })

  it.skip('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })
})
