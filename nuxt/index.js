/** @type {import('@nuxt/types').Plugin} */
export default (ctx, inject) => {
  function mande(wrappedFn, ...args) {
    return wrappedFn(
      /** @type {import('../src').MandeInstance} */
      (api) => {
        api.options.headers = { ...api.options.headers, ...ctx.req.headers }
      },
      ...args
    )
  }

  ctx.mande = mande
  inject('mande', mande)
}
