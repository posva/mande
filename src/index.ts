/**
 * Allowed options for a request. Extends native `RequestInit`.
 */
export interface Options extends RequestInit {
  /**
   * Optional query object. Does not support arrays. Will get stringified
   */
  query?: any

  /**
   * What kind of response is expected. Defaults to `json`. `response` will
   * return the raw response from `fetch`.
   */
  responseAs?: 'json' | 'text' | 'response'

  /**
   * Headers sent alongside the request
   */
  headers?: Record<string, string>
}

/**
 * Extended Error with the raw `Response` object.
 */
export interface MandeError extends Error {
  response: Response
}

/**
 * Object returned by {@link mande}
 */
export interface MandeInstance {
  /**
   * Writable options.
   */
  options: Options

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
  get(url: string | number, options?: Options): Promise<unknown>

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
  post(url: string | number, data?: any, options?: Options): Promise<unknown>
  post(data?: any, options?: Options): Promise<unknown>

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
  put(url: string | number, data?: any, options?: Options): Promise<unknown>
  put(data?: any, options?: Options): Promise<unknown>

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
  patch(url: string | number, data?: any, options?: Options): Promise<unknown>
  patch(data?: any, options?: Options): Promise<unknown>

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
  delete(url: string | number, options?: Options): Promise<unknown>
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
    base.replace(trailingSlashRE, '') + '/' + url.replace(leadingSlashRE, '')
  )
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
  instanceOptions: Options = {}
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

    let mergedOptions = {
      ...defaults,
      ...instanceOptions,
      method,
      ...localOptions,
    }

    let query = {
      ...defaults.query,
      ...instanceOptions.query,
      ...localOptions.query,
    }

    let { responseAs } = mergedOptions as Required<Options>

    mergedOptions.headers = {
      ...defaults.headers,
      ...instanceOptions.headers,
      ...localOptions.headers,
    }

    url = joinURL(baseURL, typeof url === 'number' ? '' + url : url || '')

    // TODO: warn about multiple queries provided not supported
    // if (__DEV__ && query && urlInstance.search)

    url += stringifyQuery(query)

    if (data) mergedOptions.body = JSON.stringify(data)

    return fetch(url, mergedOptions).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        if (responseAs === 'response') return response
        return response.status == 204 ? null : response[responseAs]()
      }
      let err = new Error(response.statusText) as MandeError
      err.response = response
      throw err
    })
  }

  return {
    options: instanceOptions,
    post: _fetch.bind(null, 'POST'),
    put: _fetch.bind(null, 'PUT'),
    patch: _fetch.bind(null, 'PATCH'),

    // these two have no body
    get: (url, options) => _fetch('GET', url, null, options),
    delete: (url, options) => _fetch('DELETE', url, null, options),
  }
}
