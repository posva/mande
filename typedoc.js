// @ts-check

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  name: 'Mande',
  // excludeInternal: true,
  out: 'docs-api',
  entryPoints: ['src/index.ts'],
  exclude: ['**/*.spec.ts'],
}

module.exports = config
