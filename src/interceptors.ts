import { MandeError, MandeInstance, _OptionsMerged } from './mande'

/**
 * Mande instance with interceptors.
 */
export interface MandeInstanceWithInterceptors extends MandeInstance {
  onRequest(_context: {
    url: string
    options: _OptionsMerged
  }): _MaybePromise<void>

  onResponse(_context: {
    url: string
    options: _OptionsMerged
    response: Response
  }): unknown

  onError<Error>(_context: {
    url: string
    options: _OptionsMerged
    error: MandeError<Error>
  }): _MaybePromise<MandeError | null | false | undefined | void>
}

/**
 * Internal type to define a function that may return a Promise.
 * @internal
 */
type _MaybePromise<T> = T | PromiseLike<T>

/**
 * NOTES: We currently pass a string and RequestInit options to fetch requests rather than doing new Request(url, options). Not sure if it's worth refactoring because Request is immutable (cannot change the url or body) and silently fails when changing properties
 */

export function withInterceptors(
  mande: MandeInstance
): MandeInstanceWithInterceptors {
  const mandeWithInterceptors = mande as MandeInstanceWithInterceptors

  mandeWithInterceptors.onRequest = () => {}
  mandeWithInterceptors.onResponse = () => {}
  mandeWithInterceptors.onError = () => {}

  // TODO: override

  return mandeWithInterceptors
}
