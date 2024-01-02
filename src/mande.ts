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
   * Optional function to stringify the body of the request for POST and PUT requests. Defaults to `JSON.stringify`.
   */
  stringify?: (data: unknown) => string
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

export type MandeResponse<
  T = unknown,
  ResponseType extends ResponseAsTypes = 'json'
> = Promise<
  ResponseType extends 'response'
    ? Response
    : ResponseType extends 'text'
    ? string
    : T
>

/**
 * Object returned by {@link mande}
 */
export interface MandeInstance {
  /**
   * Writable options.
   */
  options: Required<Pick<OptionsRaw, 'headers'>> & Omit<OptionsRaw, 'headers'>

  /**
   * Sends a GET request to the given url.
   *
   * @example
   * ```js
   * users.get('2').then(user => {
   *   // do something
   * })
   * ```
   * @param url - optional relative url to send the request to
   * @param options - optional {@link Options}
   */
  get<T = unknown, R extends ResponseAsTypes = 'json'>(
    options?: Options<R>
  ): MandeResponse<T, R>
  get<T = unknown, R extends ResponseAsTypes = 'json'>(
    url: string | number,
    options?: Options<R>
  ): MandeResponse<T, R>

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
  post<T = unknown, R extends ResponseAsTypes = 'json'>(
    data?: any,
    options?: Options<R>
  ): MandeResponse<T, R>
  post<T = unknown, R extends ResponseAsTypes = 'json'>(
    url: string | number,
    data?: any,
    options?: Options<R>
  ): MandeResponse<T, R>

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
  put<T = unknown, R extends ResponseAsTypes = 'json'>(
    data?: any,
    options?: Options<R>
  ): MandeResponse<T, R>
  put<T = unknown, R extends ResponseAsTypes = 'json'>(
    url: string | number,
    data?: any,
    options?: Options<R>
  ): MandeResponse<T, R>

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
  patch<T = unknown, R extends ResponseAsTypes = 'json'>(
    data?: any,
    options?: Options<R>
  ): MandeResponse<T, R>
  patch<T = unknown, R extends ResponseAsTypes = 'json'>(
    url: string | number,
    data?: any,
    options?: Options<R>
  ): MandeResponse<T, R>

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
  delete<T = unknown, R extends ResponseAsTypes = 'json'>(
    options?: Options<R>
  ): MandeResponse<T, R>
  delete<T = unknown, R extends ResponseAsTypes = 'json'>(
    url: string | number,
    options?: Options<R>
  ): MandeResponse<T, R>
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
 * Used internally for merged options.
 * @internal
 */
export type _OptionsDefaults = Options &
  Pick<Required<Options>, 'headers' | 'responseAs' | 'stringify'>
/**
 * Global default options as {@link Options} that are applied to **all** mande
 * instances. Always contain an initialized `headers` property with the default
 * headers:
 * - Accept: 'application/json'
 * - 'Content-Type': 'application/json'
 */
export const defaults: _OptionsDefaults = {
  responseAs: 'json',
  headers: {
    Accept: 'application/json',
    // NOTE: instead of passing json here, we pass it when creating the request to automatically handle FormData
    // 'Content-Type': data instanceof FormData ? null : 'application/json',
  },
  stringify: JSON.stringify,
}

/**
 * Used internally for merged options
 *
 * @internal
 */
export type _OptionsMerged = _OptionsDefaults &
  Pick<Required<Options>, 'method'>

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
    // url can be any method, data for POST/PUT/PATCH, and options for all (without url or data)
    urlOrDataOrOptions?: string | number | Options | any,
    // data for POST/PUT/PATCH, and options for all (without url or data)
    dataOrOptions?: Options | any,
    localOptions: Options = {}
  ) {
    let url: string | number
    let data: any
    // at least the URL was omitted, localOptions wasn't passed so we can safely override it
    // get(options) or put(data, options) or put(options)
    if (typeof urlOrDataOrOptions === 'object') {
      url = ''
      // if urlOrDataOrOptions is an object, it's either options or data
      // if dataOrOptions was passed, urlOrDataOrOptions is data
      localOptions = dataOrOptions || urlOrDataOrOptions || {}
      // if it's a POST/PUT/PATCH, dataOrOptions is data
      // if it's option, we will set data to options but it will be ignored later
      data = urlOrDataOrOptions
    } else {
      // get(url) or get(url, options) or put(url, data) or put(url, data, options)
      url = urlOrDataOrOptions
      data = dataOrOptions
    }

    let mergedOptions: _OptionsMerged = {
      ...defaults,
      ...instanceOptions,
      method,
      ...localOptions,
      // we need to ditch nullish headers
      headers: removeNullishValues({
        // let the browser automatically set the content-type with FormData
        'Content-Type': data instanceof FormData ? null : 'application/json',
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

    let { responseAs } = mergedOptions

    url = joinURL(baseURL, typeof url === 'number' ? '' + url : url || '')

    // TODO: warn about multiple queries provided not supported
    // if (__DEV__ && query && urlInstance.search)

    // TODO: use URL and URLSearchParams
    url += stringifyQuery(query)

    // only stringify body if it's a POST/PUT/PATCH, otherwise it could be the options object
    // it's not used by GET/DELETE but it would also be wasteful
    if (method[0] === 'P' && data && !mergedOptions.body) {
      mergedOptions.body =
        data instanceof FormData ? data : mergedOptions.stringify(data)
    }

    // we check the localFetch here to account for global fetch polyfills and msw in tests
    const localFetch = typeof fetch != 'undefined' ? fetch : fetchPolyfill!

    if (!localFetch) {
      throw new Error(
        'No fetch function exists. Make sure to include a polyfill on Node.js.'
      )
    }

    return localFetch(url, mergedOptions)
      .then((response) =>
        // This is to get the response directly in the next then
        Promise.all([
          response,
          responseAs === 'response'
            ? response
            : // TODO: propagate error data to MandeError
              response[responseAs]().catch(() => null),
        ])
      )
      .then(([response, dataOrError]) => {
        if (response.status >= 200 && response.status < 300) {
          // data is a raw response when responseAs is response
          return responseAs !== 'response' && response.status == 204
            ? null
            : dataOrError
        }
        // Has better browser support and is way smaller than `class MandeError extends Error`
        let err = new Error(response.statusText) as MandeError
        err.response = response
        err.body = dataOrError
        throw err
      })
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
    get: (url?: string | number | Options, options?: Options) =>
      _fetch('GET', url, null, options),
    delete: (url?: string | number | Options, options?: Options) =>
      _fetch('DELETE', url, null, options),
  }
}

type InferArgs<F> = F extends (api: MandeInstance, ...args: infer A) => any
  ? A
  : never

/**
 * Creates an Nuxt 2 SSR compatible function that automatically proxies cookies to requests and works transparently on
 * the server and client (it still requires a fetch polyfill on Node). Note this is only needed if you need to proxy
 * cookies to the server.
 *
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
