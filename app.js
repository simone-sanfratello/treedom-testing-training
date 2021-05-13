'use strict'

const fastify = require('fastify')()
const mercurius = require('mercurius')

const add = require('./gql/add')
const trees = require('./gql/trees')

fastify.register(mercurius, {
  schema: [add.schema, trees.schema].join('\n'),
  resolvers: {
    Query: { ...add.resolvers.Query, ...trees.resolvers.Query }
  },
  graphiql: 'playground'
})

function start () {
  fastify.listen(3000, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })
}

function app () {
  return fastify
}

module.exports = { start, app }
