'use strict'

const { Client } = require('pg')
const config = require('../lib/config')

const schema = `
  extend type Query {
    trees: [Tree!]
  }

  type Tree {
    ID: ID!
    type: String!
  }
`

const resolvers = {
  Query: {
    trees: async (parent, args, { models }) => {
      /* !!! for educational purpose only */
      const client = new Client(config.database)
      await client.connect()
      const result = await client.query('SELECT id, type FROM trees')
      await client.end()

      return result.rows.map(({ id, type }) => ({ ID: id, type }))
    }
  }
}

module.exports = { resolvers, schema }
