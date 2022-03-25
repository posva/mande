## [2.0.1](https://github.com/posva/mande/compare/v2.0.0...v2.0.1) (2022-03-25)

### Bug Fixes

- return raw response with status 204 and responseAs response ([#316](https://github.com/posva/mande/issues/316)) ([8a24d69](https://github.com/posva/mande/commit/8a24d699eddcd8557bc21e31e98487066d32b383))

# [2.0.0](https://github.com/posva/mande/compare/v1.0.1...v2.0.0) (2022-03-24)

### Build System

- module build with mjs and cjs ([9026756](https://github.com/posva/mande/commit/90267563338fc85a4755051c6dd8d56b59f543f6))

### BREAKING CHANGES

- dist files have been renamed with cjs/mjs extensions.
  If you were explicitly referring dist files, you need to update the
  imports. Otherwise, you probably don't need to change anything.

## [1.0.1](https://github.com/posva/mande/compare/v1.0.0...v1.0.1) (2021-12-20)

### Bug Fixes

- **types:** handle responseAs ([725ab77](https://github.com/posva/mande/commit/725ab770546b43720133f27a202c089c393742d0))

### Features

- explicitly forbid AbortSignal to mande ([b34c5cb](https://github.com/posva/mande/commit/b34c5cb36ed83ff2c16fab1d4d7a53b1cc2a9607))

# [1.0.0](https://github.com/posva/mande/compare/v0.0.23...v1.0.0) (2021-03-24)

This version has no breaking changes. `mande` has reached a stable state and it makes sense to have a v1 now.

### Bug Fixes

- remove null headers ([#210](https://github.com/posva/mande/issues/210)) ([32fcd3e](https://github.com/posva/mande/commit/32fcd3ec83f6bd07c68e0b25ef5c222dc08b258d))

## [0.0.23](https://github.com/posva/mande/compare/v0.0.22...v0.0.23) (2020-08-10)

### Bug Fixes

- **nuxt:** missign cookies ([c9b02d2](https://github.com/posva/mande/commit/c9b02d25ce4511e1611b4f38972038c144c2428e))

## [0.0.22](https://github.com/posva/mande/compare/v0.0.21...v0.0.22) (2020-08-09)

### Features

- serialize errors body in body ([e2757d5](https://github.com/posva/mande/commit/e2757d581d5a8821bc0842d462a7832341b93f71))

## [0.0.21](https://github.com/posva/mande/compare/v0.0.20...v0.0.21) (2020-08-05)

### Bug Fixes

- **nuxt:** reject the call if failed ([62b00da](https://github.com/posva/mande/commit/62b00da12b49d3986ffb217ad5bcf9ef17f0f6da))

## [0.0.20](https://github.com/posva/mande/compare/v0.0.19...v0.0.20) (2020-07-28)

### Features

- **nuxt:** pass errros to ctx.error ([b71b043](https://github.com/posva/mande/commit/b71b043a526d7d1719d072f4f60e86d632b46082))

## [0.0.19](https://github.com/posva/mande/compare/v0.0.18...v0.0.19) (2020-07-28)

### Bug Fixes

- **types:** missing rename ([f1574a0](https://github.com/posva/mande/commit/f1574a067a8e890b5e4c7a4a676205ff8f0ec7a8))

## [0.0.18](https://github.com/posva/mande/compare/v0.0.17...v0.0.18) (2020-07-28)

### Bug Fixes

- **types:** correct nuxt types + docs ([5d08bdb](https://github.com/posva/mande/commit/5d08bdb61c6199daa6d75caf9a0332cf9bc7ff9a))

## [0.0.17](https://github.com/posva/mande/compare/v0.0.16...v0.0.17) (2020-07-27)

### Bug Fixes

- types again ([cfc073c](https://github.com/posva/mande/commit/cfc073c02dc461c4263ba59ce6c3200f56bf64e3))

## [0.0.16](https://github.com/posva/mande/compare/v0.0.15...v0.0.16) (2020-07-27)

### Bug Fixes

- missing type ([ab46705](https://github.com/posva/mande/commit/ab46705bd2d83a3085f9b64b35ecb99c283e068c))

## [0.0.15](https://github.com/posva/mande/compare/v0.0.14...v0.0.15) (2020-07-27)

### Bug Fixes

- **nuxt:** missing export ([ed3534f](https://github.com/posva/mande/commit/ed3534fccc5ee3a5cf41fc2c219f9b5efcda0939))

## [0.0.14](https://github.com/posva/mande/compare/v0.0.13...v0.0.14) (2020-07-27)

### Bug Fixes

- **nuxt:** pass correct array ([ecb88ce](https://github.com/posva/mande/commit/ecb88ce8aebb18cde2c9c3b23257f1480297157c))

## [0.0.13](https://github.com/posva/mande/compare/v0.0.12...v0.0.13) (2020-07-27)

### Bug Fixes

- **nuxt:** avoid hot reload error ([d47e46d](https://github.com/posva/mande/commit/d47e46d6a8817c075be9398d0102aa9d886af29e))
- ignore some headers when proxying ([f99d313](https://github.com/posva/mande/commit/f99d313c61e360ea5e6a5f19ce4d198e1fd4875a))

## [0.0.12](https://github.com/posva/mande/compare/v0.0.11...v0.0.12) (2020-07-23)

### Features

- **nuxt:** add buildModule ([1a5b6df](https://github.com/posva/mande/commit/1a5b6df7872f3c504a6948158b21cceed5dd3da6))

## [0.0.11](https://github.com/posva/mande/compare/v0.0.10...v0.0.11) (2020-07-23)

### Features

- **nuxt:** add nuxt plugin to copy headers ([060fe9d](https://github.com/posva/mande/commit/060fe9da2e93be8b3db3a6399bdeb4c3f03876b2))

## [0.0.10](https://github.com/posva/mande/compare/v0.0.9...v0.0.10) (2020-06-26)

### Features

- allow fetch polyfill ([a6bb3f4](https://github.com/posva/mande/commit/a6bb3f4859bb7629382b88091a32bb29fa15f695))

## [0.0.9](https://github.com/posva/mande/compare/v0.0.8...v0.0.9) (2020-06-25)

### Bug Fixes

- missing instance options ([007171e](https://github.com/posva/mande/commit/007171ef3cf9f1fb0741d0c2d573ca1532b883b6))

## [0.0.8](https://github.com/posva/mande/compare/v0.0.7...v0.0.8) (2020-06-25)

### Features

- allow passing promise type through generic ([3696cd8](https://github.com/posva/mande/commit/3696cd80b5ed1f17a4acf9fa36fad85fd6332e95))

## [0.0.7](https://github.com/posva/mande/compare/v0.0.6...v0.0.7) (2020-05-21)

### Bug Fixes

- **types:** point to the generated d.ts ([61729e2](https://github.com/posva/mande/commit/61729e209168c1ae3de034f134b292d4f5cbbca2))

## [0.0.6](https://github.com/posva/mande/compare/v0.0.5...v0.0.6) (2020-05-18)

### Bug Fixes

- use options when providing only body ([e5a9bef](https://github.com/posva/mande/commit/e5a9bef007439d42d6d6a2a7ddeffb18dd8bc34b))

### Features

- allow global defaults ([a87fdda](https://github.com/posva/mande/commit/a87fddaa1c2aea4ae05ca39bbe911d80f19cecb5))

## [0.0.5](https://github.com/posva/mande/compare/v0.0.4...v0.0.5) (2020-05-18)

### Features

- allow omitting the url in post, put, patch ([bbcdad4](https://github.com/posva/mande/commit/bbcdad4b6d99725e7ee5fe81dfcda85389950841))

## [0.0.4](https://github.com/posva/mande/compare/v0.0.3...v0.0.4) (2020-05-17)

### Bug Fixes

- allow absolute urls ([160a343](https://github.com/posva/mande/commit/160a3439cd6dcdb246f8d136f87bf52aac527f78))

## [0.0.3](https://github.com/posva/mande/compare/v0.0.2...v0.0.3) (2020-05-17)

Fixed tag

## 0.0.2 (2020-05-17)

Added docs

## 0.0.1 (2020-05-17)

Initial release
