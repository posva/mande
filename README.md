# mande [![Build Status](https://badgen.net/circleci/github/posva/mande/master)](https://circleci.com/gh/posva/mande) [![npm package](https://badgen.net/npm/v/mande)](https://www.npmjs.com/package/mande) [![coverage](https://badgen.net/codecov/c/github/posva/mande/master)](https://codecov.io/github/posva/mande) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Simple, light and extensible wrapper around fetch with smart defaults

**Requires [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) support.**

_mande_ has better defaults to communicate with APIs using `fetch`, so instead of writing:

```js
// creating a new user
fetch('/api/users', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Dio',
    password: 'irejectmyhumanityjojo',
  }),
})
  .then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json()
    }
    // reject if the response is not 2xx
    throw new Error(response.statusText)
  })
  .then((user) => {
    // ...
  })
```

You can write:

```js
const users = mande('/api/users')

users
  .post({
    name: 'Dio',
    password: 'irejectmyhumanityjojo',
  })
  .then((user) => {
    // ...
  })
```

## Installation

```sh
npm install mande
yarn add mande
```

## Usage

Creating a small layer to communicate to your API:

```js
// api/users
import { mande } from 'mande'

const users = mande('/api/users', globalOptions)

export function getUserById(id) {
  return users.get(id)
}

export function createUser(userData) {
  return users.post(userData)
}
```

Adding _Authorization_ tokens:

```js
// api/users
import { mande } from 'mande'

const todos = mande('/api/todos', globalOptions)

export function setToken(token) {
  // todos.options will be used for all requests
  todos.options.headers.Authorization = 'Bearer ' + token
}

export function clearToken() {
  delete todos.options.headers.Authorization
}

export function createTodo(todoData) {
  return todo.post(todoData)
}
```

```js
// In a different file, setting the token whenever the login status changes. This depends on your frontend code, for instance, some libraries like Firebase provide this kind of callback but you could use a watcher on Vue.
onAuthChange((user) => {
  if (user) setToken(user.token)
  else clearToken()
})
```

You can also globally add default options to all _mande_ instances:

```js
import { defaults } from 'mande'

defaults.headers.Authorization = 'Bearer token'
```

## TypeScript

All methods defined on a `mande` instance accept a type generic to type their return:

```ts
const todos = mande('/api/todos', globalOptions)

todos.get<{ text: string, id: number, isFinished: boolean }[]>().then(todos => {
  // todos is correctly typed
})
```

## SSR (and Nuxt in Universal mode)

To make Mande work on Server, make sure to provide a `fetch` polyfill and to use full URLs and not absolute URLs starting with `/`. For example, using `node-fetch`, you can do:

```js
export const BASE_URL = process.server
  ? process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://example.com'
  : // on client, do not add the domain, so urls end up like `/api/something`
    ''

const fetchPolyfill = process.server ? require('node-fetch') : fetch
const contents = mande(BASE_URL + '/api', {}, fetchPolyfill)
```

### Nuxt

When using with Nuxt **and SSR**, you must wrap exported functions so they automatically proxy cookies and headers on the server:

```js
import { mande, nuxtWrap } from 'mande'
const fetchPolyfill = process.server ? require('node-fetch') : fetch
const users = mande(BASE_URL + '/api/users', {}, fetchPolyfill)

export const getUserById = nuxtWrap(users, (api, id: string) => api.get(id))
```

Make sure to add it as a buildModule as well:

```js
// nuxt.config.js
module.exports = {
  buildModules: ['mande/nuxt'],
}
```

This prevents requests from accidentally sharing headers or bearer tokens.

#### TypeScript

Make sure to include `mande/nuxt` in your `tsconfig.json`:

```json
{
  "types": ["@types/node", "@nuxt/types", "mande/nuxt"]
}
```

## API

Most of the code can be discovered through the autocompletion but the API documentation is available at https://posva.net/mande/.

## Related

- [fetchival](https://github.com/typicode/fetchival): part of the code was borrowed from it and the api is very similar
- [axios](https://github.com/axios/axios):

## License

[MIT](http://opensource.org/licenses/MIT)
