import { vi, expect, describe, it, expectTypeOf } from 'vitest'
import { mande, defaults } from '../src'

describe('mande', () => {
  it('calls fetch', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())

    let api = mande('/api/')
    await expect(api.get('')).resolves
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      '/api/',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })
    )
  })

  it('can use a number', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await expect(api.get(0)).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/0', expect.anything())
  })

  it('works with non trailing slashes', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await expect(api.get('/2')).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/2', expect.anything())
  })

  it('can use get without parameters', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await expect(api.get()).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/', expect.anything())
  })

  it('allows an absolute base', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('http://example.com/api/')
    await expect(api.get('')).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith(
      'http://example.com/api/',
      expect.anything()
    )
  })

  it('returns null on 204', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 200 }))
    let api = mande('/api/')
    await expect(api.get('')).resolves.toEqual(null)
  })

  it('calls delete', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await expect(api.delete('')).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/api/',
      expect.objectContaining({
        method: 'DELETE',
      })
    )
  })

  it('calls delete without parameters', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await expect(api.delete()).resolves.toEqual({})
    expect(spy.mock.calls[0][1]).not.toHaveProperty('body')
  })

  it('rejects if not ok', async () => {
    const response = Response.json({}, { status: 404 })
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response)
    let api = mande('/api/')
    await expect(api.get('')).rejects.toHaveProperty('response', response)
  })

  it('serializes body on error', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({ message: 'nope' }, { status: 404 }))
    let api = mande('/api/')
    await expect(api.get('')).rejects.toMatchObject({
      response: expect.anything(),
      body: { message: 'nope' },
    })
  })

  it('works with empty failed request', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json(null, { status: 404 }))
    let api = mande('/api/')
    await expect(api.get('')).rejects.toMatchObject({
      response: expect.anything(),
      body: null,
    })
  })

  it('can pass a query', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await expect(
      api.get('', { query: { foo: 'a', bar: 'b' } })
    ).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/?foo=a&bar=b', expect.anything())
  })

  it('can use get with options only', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await expect(api.get({ query: { foo: 'a', bar: 'b' } })).resolves.toEqual(
      {}
    )
    expect(spy).toHaveBeenCalledWith('/api/?foo=a&bar=b', expect.anything())
  })

  it('merges global query', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/', { query: { foo: 'a' } })
    await expect(api.get('', { query: { bar: 'b' } })).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/?foo=a&bar=b', expect.anything())
  })

  it('can pass a body', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await expect(api.put('', { foo: 'a', bar: 'b' })).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/api/',
      expect.objectContaining({
        body: '{"foo":"a","bar":"b"}',
        method: 'PUT',
      })
    )
  })

  it('can omit the url', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/users')
    await expect(api.put({ foo: 'a', bar: 'b' })).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        body: '{"foo":"a","bar":"b"}',
        method: 'PUT',
      })
    )
  })

  it('can add custom headers', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await api.get('2', { headers: { Authorization: 'Bearer foo' } })
    expect(spy).toHaveBeenCalledWith(
      '/api/2',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer foo',
        },
      })
    )
  })

  it('can add custom headers through instance', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    api.options.headers.Authorization = 'token secret'
    await api.get('2', { headers: { other: 'foo' } })
    expect(spy).toHaveBeenCalledWith(
      '/api/2',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'token secret',
          other: 'foo',
        },
      })
    )
    // should not fail in TS
    api.options.headers.Authorization = 'token secret'
  })

  it('can remove a default header', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/', { headers: { 'Content-Type': null } })
    await api.get('2')
    expect(spy).toHaveBeenCalledWith(
      '/api/2',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          // no Content-Type
          'Content-Type': undefined,
        },
      })
    )
  })

  it('keeps empty strings headers', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/', { headers: { 'Content-Type': '' } })
    await api.get('2')
    expect(spy).toHaveBeenCalledWith(
      '/api/2',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Content-Type': '',
        },
      })
    )
  })

  it('can return a raw response', async () => {
    const response = Response.json({})
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response)
    let api = mande('/api/')
    await api.get('', { responseAs: 'response' }).then((res) => {
      expectTypeOf<Response>(res)
      expect(res).toBe(response)
    })
    // cannot check the result for some reason...
    function tds() {
      const noDataMethods = ['get', 'delete'] as const
      const dataMethods = ['post', 'put', 'patch'] as const
      for (const method of dataMethods) {
        expectTypeOf<Promise<{ value: number }>>(
          api[method]<{ value: number }>('/api')
        )
        api[method]('/api').then((r) => {
          expectTypeOf<unknown>(r)
          // @ts-expect-error: r is unknown
          r.stuff
        })
        expectTypeOf<Promise<Response>>(
          api[method](2, { responseAs: 'response' })
        )
        expectTypeOf<Promise<string>>(api[method](2, { responseAs: 'text' }))
      }

      for (const method of noDataMethods) {
        expectTypeOf<Promise<{ value: number }>>(
          api[method]<{ value: number }>('/api')
        )
        api[method]('/api').then((r) => {
          expectTypeOf<unknown>(r)
          // @ts-expect-error: r is unknown
          r.stuff
        })
        expectTypeOf<Promise<Response>>(
          api[method](2, { responseAs: 'response' })
        )
        expectTypeOf<Promise<string>>(api[method](2, { responseAs: 'text' }))
      }
    }
  })

  it('can return a raw response when called without url parameter', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await api.get({ responseAs: 'response' }).then((res) => {
      expect(res).not.toBeNull()
      expectTypeOf<Response>(res)
    })
  })

  it('can return a raw response with status code 204', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }))
    let api = mande('/api/')
    await api.get('', { responseAs: 'response' }).then((res) => {
      expect(res).not.toBeNull()
      expectTypeOf<Response>(res)
    })
  })

  it('can return a text response when called without url parameter', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await api.get({ responseAs: 'text' }).then((res) => {
      expect(res).not.toBeNull()
      expectTypeOf<string>(res)
    })
  })

  it('can return a raw response when delete called without url parameter', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }))
    let api = mande('/api/')
    await api.delete({ responseAs: 'response' }).then((res) => {
      expect(res).not.toBeNull()
      expectTypeOf<Response>(res)
    })
  })

  it('can return a text response when delete called without url parameter', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await api.delete({ responseAs: 'text' }).then((res) => {
      expect(res).not.toBeNull()
      expectTypeOf<string>(res)
    })
  })

  it('can add global defaults', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    defaults.query = { foo: 'bar' }
    // defaults.headers.Authorization = { foo: 'bar' }
    await expect(api.get('2')).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/2?foo=bar', expect.anything())
    delete defaults.query
  })

  it('can be passed a signal', async () => {
    const controller = new AbortController()
    const { signal } = controller

    // @ts-expect-error: signal cannot be passed to mande
    mande('/api', { signal })
    let api = mande('/api')
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))

    await expect(api.get('1', { signal })).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/api/1',
      expect.objectContaining({
        signal,
      })
    )
  })

  it('does not add trailing slashes', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api')
    await expect(api.get('')).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api', expect.anything())
  })

  it('ensure in between slashes', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api')
    await expect(api.get('2')).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/2', expect.anything())
  })

  it('adds explicit trailing slash', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api')
    await expect(api.get('/')).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/', expect.anything())
  })

  it('avoids duplicated slashes', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')
    await expect(api.get('/2')).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith('/api/2', expect.anything())
  })

  it('calls the stringify with data on put and post', async () => {
    const stringify = vi.fn().mockReturnValue({ foo: 'bar' })

    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => Response.json({}))
    let api = mande('/api/', { stringify: stringify })
    const data = {}
    await expect(api.post(data)).resolves.toEqual({})
    expect(stringify).toHaveBeenCalledTimes(1)
    expect(stringify).toHaveBeenCalledWith(data)
    // second arg
    await expect(api.put('/a', data)).resolves.toEqual({})
    expect(stringify).toHaveBeenCalledTimes(2)
    expect(stringify).toHaveBeenNthCalledWith(2, data)
  })

  it('keeps FormData as is', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')

    const data = new FormData()
    await expect(api.post(data)).resolves.toEqual({})
    expect(spy).toHaveBeenCalledWith(
      '/api/',
      expect.objectContaining({ body: data })
    )
  })

  it('deletes Content-Type header with FormData', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({}))
    let api = mande('/api/')

    const data = new FormData()
    await api.post(data)
    expect(spy).toHaveBeenCalledWith(
      '/api/',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Content-Type': undefined,
        },
      })
    )
  })
})
