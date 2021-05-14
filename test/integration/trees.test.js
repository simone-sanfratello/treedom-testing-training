'use strict'

process.env.DATABASE_HOST = 'localhost'
process.env.DATABASE_PORT = 5432
process.env.DATABASE_USER = 'pg'
process.env.DATABASE_PASS = 'none'
process.env.DATABASE_NAME = 'tree'

const t = require('tap')
const helper = require('../helper')
const config = require('../../lib/config')

let fastify

t.before(async () => {
  await helper.startDatabase(config.database)
  const { app } = require('../../app')
  fastify = app()
})

t.teardown(async () => {
  await helper.stopDatabase()
  await fastify.close()
})

t.test('should get all trees types', async (t) => {
  // arrange
  await helper.fillTableTrees([{ id: '1', type: 'ciliegio' }, { id: '2', type: 'pesco' }])

  // act
  const query = '{ trees { ID, type } }'
  const response = await fastify.inject({
    method: 'POST',
    url: '/graphql',
    body: { query }
  })

  // assert
  t.same(response.json(), {
    data: {
      trees:
        [{ ID: '1', type: 'ciliegio' }, { ID: '2', type: 'pesco' }]
    }
  })
})
