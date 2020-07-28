import '@nuxt/types'

declare module '@nuxt/types' {
  interface Context {
    mande: <F extends (...args: any[]) => any>(
      fn: F,
      ...args: Parameters<F>
    ) => ReturnType<F>
  }
}
