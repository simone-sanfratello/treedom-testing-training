'use strict'

const { sum } = require('../lib/sum')

const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
`

const resolvers = {
  Query: {
    add: async (_, obj) => {
      const { x, y } = obj
      return sum(x, y)
    }
  }
}

module.exports = { resolvers, schema }
