import path from 'path'

const DEFAULT_OPTIONS = {
  callError: true,
  proxyHeadersIgnore: [
    'accept',
    'host',
    'cf-ray',
    'cf-connecting-ip',
    'content-length',
    'content-md5',
    'content-type',
  ],
}

/** @type {import('@nuxt/types').Module} */
const MandeModule = function NuxtMandeModule(localOptions) {
  // TODO: merge arrays properly. There is probably a package to handle this
  const options = {
    ...DEFAULT_OPTIONS,
    ...localOptions,
  }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'mande.js',
    // FIXME: figure out why options end up being undefined
    options,
  })
}

module.exports = MandeModule
