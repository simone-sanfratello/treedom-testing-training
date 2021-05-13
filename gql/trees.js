'use strict'

const { Client } = require('pg')

const schema = `
  extend type Query {
    trees: [Tree!]
  }

  type Tree {
    id: ID!
    type: String!
  }
`

const resolvers = {
  Query: {
    trees: async (parent, args, { models }) => {
      /* !!! for educational purpose only */
      const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB
      })
      await client.connect()
      const result = await client.query('SELECT id, type FROM trees')
      await client.end()

      return result.rows
    }
  }
}

module.exports = { resolvers, schema }
