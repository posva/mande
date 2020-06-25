import { mande, defaults } from '../src'
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

  it('can use a number', async () => {
    let api = mande('/api')
    fetchMock.mock('/api/0', { status: 200, body: {} })
    await expect(api.get(0)).resolves.toEqual({})
    expect(fetchMock).toHaveFetched('/api/0')
  })

  it('works with non trailing slashes', async () => {
    let api = mande('/api')
    fetchMock.mock('/api/2', { status: 200, body: {} })
    await expect(api.get('/2')).resolves.toEqual({})
    expect(fetchMock).toHaveFetched('/api/2')
  })

  it('allows an absolute base', async () => {
    let api = mande('http://example.com/api/')
    fetchMock.mock('http://example.com/api/', { status: 200, body: {} })
    await expect(api.get('')).resolves.toEqual({})
    expect(fetchMock).toHaveFetched('http://example.com/api/')
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

  it('can omit the url', async () => {
    let api = mande('/api/users')
    fetchMock.put('/api/users/', { body: {} })
    await expect(api.put({ foo: 'a', bar: 'b' })).resolves.toEqual({})
    expect(fetchMock).toHaveFetched('/api/users/', {
      body: { foo: 'a', bar: 'b' },
    })
  })

  it('can add custom headers', async () => {
    let api = mande('/api')
    fetchMock.get('/api/2', { body: { foo: 'a', bar: 'b' } })
    await api.get('2', { headers: { Authorization: 'Bearer foo' } })
    expect(fetchMock).toHaveFetched('/api/2', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer foo',
      },
    })
  })

  it('can add custom headers through instance', async () => {
    let api = mande('/api')
    api.options.headers.Authorization = 'token secret'
    fetchMock.get('/api/2', { body: { foo: 'a', bar: 'b' } })
    await api.get('2', { headers: { other: 'foo' } })
    expect(fetchMock).toHaveFetched('/api/2', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'token secret',
        other: 'foo',
      },
    })
    // should not fail in TS
    api.options.headers.Authorization = 'token secret'
  })

  it('can return a raw response', async () => {
    let api = mande('/api/')
    fetchMock.get('/api/', { body: { foo: 'a', bar: 'b' } })
    await api.get('', { responseAs: 'response' })
    // cannot check the result for some reason...
  })

  it('can add global defaults', async () => {
    let api = mande('/api/')
    defaults.query = { foo: 'bar' }
    // defaults.headers.Authorization = { foo: 'bar' }
    fetchMock.mock('/api/2?foo=bar', { status: 200, body: {} })
    await expect(api.get('2')).resolves.toEqual({})
    expect(fetchMock).toHaveFetched('/api/2?foo=bar')
  })
})
