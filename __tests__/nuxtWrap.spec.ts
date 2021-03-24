import { mande, nuxtWrap } from '../src'
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
})
