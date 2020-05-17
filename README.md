# mande [![Build Status](https://badgen.net/circleci/github/posva/mande/master)](https://circleci.com/gh/posva/mande) [![npm package](https://badgen.net/npm/v/mande)](https://www.npmjs.com/package/mande) [![coverage](https://badgen.net/codecov/c/github/posva/mande/master)](https://codecov.io/github/posva/mande) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Simple, light and easy to use wrapper around fetch

## Installation

```sh
npm install mande
yarn add mande
```

## Usage

```js
import { mande } from 'mande'

// make sure to add the leading slash
const users = mande('/api/users/', globalOptions)

// no leading slash before the url
users.get('2').then(user => {
  // do something with user
})
```

## API

Most of the code can be discovered through the autocompletion but the API documentation is available at https://posva.net/mande/.

## Related

- [fetchival](https://github.com/typicode/fetchival)
- [axios](https://github.com/axios/axios)

## License

[MIT](http://opensource.org/licenses/MIT)
