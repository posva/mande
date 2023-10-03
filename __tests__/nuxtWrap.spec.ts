import { expect, describe, it, vi } from 'vitest'
import { mande, nuxtWrap } from '../src'

describe('Nuxt wrapping', () => {
  it('calls fetch', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    const wrapped = nuxtWrap(api, (api, n: number) => {
      return api.get<{}>(n)
    })
    await expect(wrapped(20)).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/20', expect.anything())
  })
})
