import { mande } from '../src'
import { FetchMockStatic } from 'fetch-mock'
import './global.d.ts'
jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock: FetchMockStatic = require('node-fetch')

describe('mande', () => {
  // @ts-ignore
  global.fetch = fetchMock
  // let fetchSpy = global.fetch = jest.fn()

  beforeEach(() => {
    // @ts-ignore
    fetchMock.mockReset()
    // fetchSpy.mockReset()
    // fetchSpy.mockImplementation(() => Promise.resolve())
  })

  afterEach(() => {})

  it('calls fetch', async () => {
    let api = mande('/api/')
    fetchMock.mock('/api/', { status: 200, body: {} })
    await expect(api.get('')).resolves.toEqual({})
    expect(fetchMock).toHaveFetched('/api/')
  })

  it('returns null on 204', async () => {
    let api = mande('/api/')
    fetchMock.mock('/api/', 204)
    await expect(api.get('')).resolves.toEqual(null)
    expect(fetchMock).toHaveFetched('/api/')
  })

  it('calls delete', async () => {
    let api = mande('/api/')
    fetchMock.mock('/api/', 204)
    await expect(api.delete('')).resolves.toEqual(null)
    expect(fetchMock).toHaveFetched('/api/')
  })

  it('rejects if not ok', async () => {
    let api = mande('/api/')
    fetchMock.get('/api/', 404)
    await expect(api.get('')).rejects.toMatchObject({
      response: expect.anything(),
    })
  })

  it('can pass a query', async () => {
    let api = mande('/api/')
    fetchMock.get('/api/?foo=a&bar=b', { body: {} })
    await expect(
      api.get('', { query: { foo: 'a', bar: 'b' } })
    ).resolves.toEqual({})
  })

  it('merges global query', async () => {
    let api = mande('/api/', { query: { foo: 'a' } })
    fetchMock.get('/api/?foo=a&bar=b', { body: {} })
    await expect(api.get('', { query: { bar: 'b' } })).resolves.toEqual({})
  })

  it('can pass a body', async () => {
    let api = mande('/api/')
    fetchMock.put('/api/', { body: {} })
    await expect(api.put('', { foo: 'a', bar: 'b' })).resolves.toEqual({})
    expect(fetchMock).toHaveFetched('/api/', { body: { foo: 'a', bar: 'b' } })
  })

  it('can return a raw response', async () => {
    let api = mande('/api/')
    fetchMock.get('/api/', { body: { foo: 'a', bar: 'b' } })
    await (api.get('', { responseAs: 'response' }))
    // cannot check the result for some reason...
  })
})
