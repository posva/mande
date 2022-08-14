/**
 * Allowed options for a request. Extends native `RequestInit`.
 */
export interface Options<ResponseAs extends ResponseAsTypes = ResponseAsTypes>
  extends RequestInit {
  /**
   * Optional query object. Does not support arrays. Will get stringified
   */
  query?: any

  /**
   * What kind of response is expected. Defaults to `json`. `response` will
   * return the raw response from `fetch`.
   */
  responseAs?: ResponseAs

  /**
   * Headers sent alongside the request
   */
  headers?: Record<string, string>

  /**
   * Intercept the success response
   * @param response The response that would naturaly be returned if not set
   * @return transformed (or not) data
   */
  onSuccess?(response: Response): Response | unknown | Promise<Response | unknown>

  /**
   * Intercept the error response
   * @param error The error that would naturaly be thrown if not set
   * @return transformed (or not) data
   */
  onError?(error: MandeError): MandeError | unknown | Promise<MandeError | unknown>
}

export type ResponseAsTypes = 'json' | 'text' | 'response'

export interface OptionsRaw<R extends ResponseAsTypes = ResponseAsTypes>
  extends Omit<Options<R>, 'headers' | 'signal'> {
  /**
   * Headers sent alongside the request. Set any header to null to remove it.
   */
  headers?: Record<string, string | null>

  /**
   * AbortSignal can only be passed to requests, not to a mande instance
   * because it can only be used once.
   */
  signal?: never
}

/**
 * Extended Error with the raw `Response` object.
 */
export interface MandeError<T = any> extends Error {
  body: T
  response: Response
}

/**
 * Object returned by {@link mande}
 */
export interface MandeInstance {
  /**
   * Writable options.
   */
  options: Required<Pick<OptionsRaw, 'headers'>> &
    Pick<OptionsRaw, 'responseAs' | 'query'>

  /**
   * Sends a GET request to the given url.
   *
   * @example
   * ```js
   * users.get('2').then(user => {
   *   // do something
   * })
   * ```
   * @param url - relative url to send the request to
   * @param options - optional {@link Options}
   */
  get(url: string | number, options: Options<'response'>): Promise<Response>
  get(url: string | number, options: Options<'text'>): Promise<string>
  get<T = unknown>(url: string | number, options?: Options): Promise<T>

  /**
   * Sends a POST request to the given url.
   *
   * @example
   * ```js
   * users.post('', { name: 'Eduardo' }).then(user => {
   *   // do something
   * })
   * ```
   * @param url - relative url to send the request to
   * @param data - optional body of the request
   * @param options - optional {@link Options}
   */
  post(
    url: string | number,
    data: any,
    options: Options<'text'>
  ): Promise<string>
  post(data: any, options: Options<'text'>): Promise<string>
  post(
    url: string | number,
    data: any,
    options: Options<'response'>
  ): Promise<Response>
  post(data: any, options: Options<'response'>): Promise<Response>
  post<T = unknown>(data?: any, options?: Options): Promise<T>
  post<T = unknown>(
    url: string | number,
    data?: any,
    options?: Options
  ): Promise<T>

  /**
   * Sends a PUT request to the given url.
   *
   * @example
   * ```js
   * users.put('2', { name: 'Eduardo' }).then(user => {
   *   // do something
   * })
   * ```
   * @param url - relative url to send the request to
   * @param data - optional body of the request
   * @param options - optional {@link Options}
   */
  put(
    url: string | number,
    data: any,
    options: Options<'text'>
  ): Promise<string>
  put(data: any, options: Options<'text'>): Promise<string>
  put(
    url: string | number,
    data: any,
    options: Options<'response'>
  ): Promise<Response>
  put(data: any, options: Options<'response'>): Promise<Response>
  put<T = unknown>(
    url: string | number,
    data?: any,
    options?: Options
  ): Promise<T>
  put<T = unknown>(data?: any, options?: Options): Promise<T>

  /**
   * Sends a PATCH request to the given url.
   *
   * @example
   * ```js
   * users.patch('2', { name: 'Eduardo' }).then(user => {
   *   // do something
   * })
   * ```
   * @param url - relative url to send the request to
   * @param data - optional body of the request
   * @param options - optional {@link Options}
   */
  patch(
    url: string | number,
    data: any,
    options: Options<'response'>
  ): Promise<Response>
  patch(data: any, options: Options<'response'>): Promise<Response>
  patch(
    url: string | number,
    data: any,
    options: Options<'text'>
  ): Promise<string>
  patch(data: any, options: Options<'text'>): Promise<string>
  patch<T = unknown>(
    url: string | number,
    data?: any,
    options?: Options
  ): Promise<T>
  patch<T = unknown>(data?: any, options?: Options): Promise<T>

  /**
   * Sends a DELETE request to the given url.
   *
   * @example
   * ```js
   * users.delete('2').then(user => {
   *   // do something
   * })
   * ```
   * @param url - relative url to send the request to
   * @param options - optional {@link Options}
   */
  delete(url: string | number, options: Options<'response'>): Promise<Response>
  delete(url: string | number, options: Options<'text'>): Promise<string>
  delete<T = unknown>(url: string | number, options?: Options): Promise<T>
}

function stringifyQuery(query: any): string {
  let searchParams = Object.keys(query)
    .map((k) => [k, query[k]].map(encodeURIComponent).join('='))
    .join('&')
  return searchParams ? '?' + searchParams : ''
}

let trailingSlashRE = /\/+$/
let leadingSlashRE = /^\/+/

function joinURL(base: string, url: string): string {
  return (
    base +
    (url &&
      (base.endsWith('/')
        ? url.replace(leadingSlashRE, '')
        : url.startsWith('/')
        ? url
        : '/' + url))
  )
}

function removeNullishValues(
  headers: Exclude<OptionsRaw['headers'], undefined>
): Exclude<Options['headers'], undefined> {
  return Object.keys(headers).reduce((newHeaders, headerName) => {
    if (headers[headerName] != null) {
      // @ts-ignore
      newHeaders[headerName] = headers[headerName]
    }
    return newHeaders
  }, {} as Exclude<Options['headers'], undefined>)
}

/**
 * Global default options as {@link Options} that are applied to **all** mande
 * instances. Always contain an initialized `headers` property with the default
 * headers:
 * - Accept: 'application/json'
 * - 'Content-Type': 'application/json'
 */
export const defaults: Options &
  Pick<Required<Options>, 'headers' | 'responseAs'> = {
  responseAs: 'json',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

/**
 * Create a Mande instance
 *
 * @example
 * ```js
 * const users = mande('/api/users')
 * users.get('2').then(user => {
 *   // do something
 * })
 * ```
 * @param baseURL - absolute url
 * @param instanceOptions - optional options that will be applied to every
 * other request for this instance
 */
export function mande(
  baseURL: string,
  passedInstanceOptions: OptionsRaw = {},
  fetchPolyfill?: Window['fetch']
): MandeInstance {
  function _fetch(
    method: string,
    urlOrData?: string | number | any,
    dataOrOptions?: Options | any,
    localOptions: Options = {}
  ) {
    let url: string | number
    let data: any
    if (typeof urlOrData === 'object') {
      url = ''
      data = urlOrData
      localOptions = dataOrOptions || {}
    } else {
      url = urlOrData
      data = dataOrOptions
    }

    let mergedOptions: Options = {
      ...defaults,
      ...instanceOptions,
      method,
      ...localOptions,
      // we need to ditch nullish headers
      headers: removeNullishValues({
        ...defaults.headers,
        ...instanceOptions.headers,
        ...localOptions.headers,
      }),
    }

    let query = {
      ...defaults.query,
      ...instanceOptions.query,
      ...localOptions.query,
    }

    let { responseAs } = mergedOptions as Required<Options>

    url = joinURL(baseURL, typeof url === 'number' ? '' + url : url || '')

    // TODO: warn about multiple queries provided not supported
    // if (__DEV__ && query && urlInstance.search)

    url += stringifyQuery(query)

    if (data) mergedOptions.body = JSON.stringify(data)

    return localFetch(url, mergedOptions)
      .then((response) =>
        Promise.all([
          response,
          responseAs === 'response'
            ? response
            : response[responseAs]().catch(() => null),
        ])
      )
      .then(([response, data]) => {
        if (response.status >= 200 && response.status < 300) {
          // data is a raw response when responseAs is response
          const resp =
            responseAs !== 'response' && response.status == 204 ? null : data
          if (mergedOptions.onSuccess) return mergedOptions.onSuccess(resp)
          return resp
        }
        let err = new Error(response.statusText) as MandeError
        err.response = response
        err.body = data
        if (mergedOptions.onError)
          return Promise.reject(mergedOptions.onError(err))
        throw err
      })
  }

  const localFetch = typeof fetch != 'undefined' ? fetch : fetchPolyfill!

  if (!localFetch) {
    throw new Error(
      'No fetch function exists. Make sure to include a polyfill on Node.js.'
    )
  }

  const instanceOptions: MandeInstance['options'] = {
    query: {},
    headers: {},
    ...passedInstanceOptions,
  }

  return {
    options: instanceOptions,
    post: _fetch.bind(null, 'POST'),
    put: _fetch.bind(null, 'PUT'),
    patch: _fetch.bind(null, 'PATCH'),

    // these two have no body
    get: (url: string, options?: Options) => _fetch('GET', url, null, options),
    delete: (url: string, options?: Options) =>
      _fetch('DELETE', url, null, options),
  }
}

type InferArgs<F> = F extends (api: MandeInstance, ...args: infer A) => any
  ? A
  : never

/**
 * Creates an Nuxt SSR compatible function that automatically proxies cookies
 * to requests and works transparently on the server and client (it still
 * requires a fetch polyfill on Node).
 * @example
 * ```js
 * import { mande, nuxtWrap } from 'mande'
 *
 * const fetchPolyfill = process.server ? require('node-fetch') : fetch
 * const users = mande(BASE_URL + '/api/users', {}, fetchPolyfill)
 *
 * export const getUserById = nuxtWrap(users, (api, id: string) => api.get(id))
 * ```
 *
 * @param api - Mande instance to wrap
 * @param fn - function to be wrapped
 */
export function nuxtWrap<
  M extends MandeInstance,
  F extends (api: M, ...args: any[]) => any
>(api: M, fn: F): (...args: InferArgs<F>) => ReturnType<F> {
  // args for the api call + 1 because of api parameter
  const argsAmount = fn.length

  const wrappedCall: (...args: InferArgs<F>) => ReturnType<F> =
    function _wrappedCall() {
      let apiInstance: M = api
      let args = Array.from(arguments) as InferArgs<F>
      // call from nuxt server with a function to augment the api instance
      if (arguments.length === argsAmount) {
        apiInstance = { ...api }

        // remove the first argument
        const [augmentApiInstance] = args.splice(0, 1) as [(api: M) => void]

        // let the caller augment the instance
        augmentApiInstance(apiInstance)
      }

      return fn.call(null, apiInstance, ...args)
    }

  return wrappedCall
}
