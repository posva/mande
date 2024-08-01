import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import type { NuxtModule } from 'nuxt/schema'

// Module options TypeScript interface definition
export interface ModuleOptions {}

const mandeModule: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})

export default mandeModule
