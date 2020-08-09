import { mande, defaults, nuxtWrap } from '../src'
import { FetchMockStatic } from 'fetch-mock'
import './global.d.ts'
jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock: FetchMockStatic = require('node-fetch')

describe('Nuxt wrapping', () => {
  // @ts-ignore
  global.fetch = fetchMock
  // let fetchSpy = global.fetch = jest.fn()

  beforeEach(() => {
    // @ts-ignore
    fetchMock.mockReset()
    // fetchSpy.mockReset()
    // fetchSpy.mockImplementation(() => Promise.resolve())
  })

  it('calls fetch', async () => {
    let api = mande('/api/')
    fetchMock.mock('/api/20', { status: 200, body: {} })
    const wrapped = nuxtWrap(api, (api, n: number) => {
      return api.get<{}>(n)
    })
    await expect(wrapped(20)).resolves.toEqual({})
    expect(fetchMock).toHaveFetched('/api/20')
  })

  it('creates a copy', async () => {
    let api = mande('/api/')
    fetchMock.mock('/api/20', { status: 200, body: {} })
    api.options.headers.before = 'true'
    const wrapped = nuxtWrap(api, (local, n: number) => {
      local.options.headers.other = 'true'
      expect(local.options.headers).toEqual({
        before: 'true',
        other: 'true',
        after: 'true',
      })
      return local.get<{}>(n)
    })
    api.options.headers.after = 'true'
    // @ts-ignore: simulate the nuxt plugin
    await expect(wrapped(() => { }, 20)).resolves.toEqual({})
    expect(fetchMock).toHaveFetched('/api/20')
    expect(api.options.headers).toEqual({ before: 'true', after: 'true' })
  })
})
