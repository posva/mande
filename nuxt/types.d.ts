import { MandeInstance } from '../src'

declare module '@nuxt/types' {
  interface Context {
    mande: <F extends (api: MandeInstance, ...args: any[]) => any>(
      api: MandeInstance,
      fn: F
    ) => ReturnType<F>
  }
}
