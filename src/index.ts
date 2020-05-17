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
}

/**
 * Extended Error with the raw `Response` object.
 */
export interface MandeError extends Error {
  response: Response
}

type RequiredRequestInit = Required<RequestInit>

/**
 * Object returned by {@link mande}
 */
export interface MandeInstance {
  /**
   * Writable options.
   */
  options: Options & Pick<RequiredRequestInit, 'headers'>

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
  get(url: string, options?: Options): Promise<unknown>

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
  post(url: string, data?: any, options?: Options): Promise<unknown>

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
  put(url: string, data?: any, options?: Options): Promise<unknown>

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
  patch(url: string, data?: any, options?: Options): Promise<unknown>

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
  delete(url: string, options?: Options): Promise<unknown>
}

function stringifyQuery(query: any): string {
  let searchParams = Object.keys(query)
    .map((k) => [k, query[k]].map(encodeURIComponent).join('='))
    .join('&')
  return searchParams ? '?' + searchParams : ''
}

// use a short base url to parse
let newURL = (url: string, base: string) => new URL(url, 'http://e.e' + base)

/**
 * Create a Mande instance
 *
 * @example
 * ```js
 * const users = mande('/api/users/')
 * users.get('2').then(user => {
 *   // do something
 * })
 * ```
 * @param baseURL - absolute url with a leading slash
 * @param globalOptions - optional global options that will be applied to every
 * other request
 */
export function mande(
  baseURL: string,
  globalOptions: Options = {}
): MandeInstance {
  let options = {
    responseAs: 'json' as Options['responseAs'],
    headers: {},
    ...globalOptions,
  }

  function _fetch(
    method: string,
    url?: string,
    data?: any,
    localOptions: Options = {}
  ) {
    let mergedOptions = {
      ...options,
      method,
      ...localOptions,
    }

    let query = {
      ...options.query,
      ...localOptions.query,
    }

    let { responseAs } = mergedOptions as Required<Options>

    mergedOptions.headers = {
      ...options.headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...localOptions.headers,
    }

    let urlInstance = newURL(url || '', baseURL)
    url = urlInstance.pathname + urlInstance.search

    // TODO:
    // if (__DEV__ && url.startsWith('/'))

    // TODO:
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

  // TODO:
  // if (__DEV__ && !baseURL.endsWith('/'))

  return {
    options,
    post: _fetch.bind(null, 'POST'),
    put: _fetch.bind(null, 'PUT'),
    patch: _fetch.bind(null, 'PATCH'),

    // these two have no body
    get: (url, options) => _fetch('GET', url, null, options),
    delete: (url, options) => _fetch('DELETE', url, null, options),
  }
}
