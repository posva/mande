'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/mande.prod.cjs')
} else {
  module.exports = require('./dist/mande.cjs')
}
