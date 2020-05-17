export interface Options extends RequestInit {
  query?: any
  /**
   * What kind of response is expected. Defaults to `json`. `response` will
   * return the raw response from `fetch`.
   */
  responseAs?: 'json' | 'text' | 'response'
}

export interface MandeError extends Error {
  response: Response
}

type RequiredRequestInit = Required<RequestInit>

export interface MandeInstance {
  options: Options & Pick<RequiredRequestInit, 'headers'>

  get(url: string, options?: Options): Promise<unknown>

  post(url: string, data?: any, options?: Options): Promise<unknown>
  put(url: string, data?: any, options?: Options): Promise<unknown>
  patch(url: string, data?: any, options?: Options): Promise<unknown>

  delete(url: string, options?: Options): Promise<unknown>
}

function stringifyQuery(query: any): string {
  let searchParams = Object.keys(query).map((k) =>
    [k, query[k]].map(encodeURIComponent).join('=')
  ).join('&')
  return searchParams ? '?' + searchParams : ''
}

// use a short base url to parse
let newURL = (url: string, base: string) =>
  new URL(url, 'http://e.e' + base)

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
