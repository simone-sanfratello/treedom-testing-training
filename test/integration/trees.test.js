'use strict'

const t = require('tap')
const helper = require('../helper')

let fastify

process.env.DB_HOST = 'localhost'
process.env.DB_PORT = 5432
process.env.DB_USER = 'pg'
process.env.DB_PASS = 'none'
process.env.DB_DB = 'tree'

t.before(async () => {
  await helper.startDatabase({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    db: process.env.DB_DB
  })

  const { app } = require('../../app')
  fastify = app()
})

t.teardown(async () => {
  await helper.stopDatabase()
  await fastify.close()
})

t.test('should get all trees types', async (t) => {
  // act
  const query = '{ trees { id, type } }'
  const response = await fastify.inject({
    method: 'POST',
    url: '/graphql',
    body: { query }
  })

  // assert
  t.same(JSON.parse(response.body), { data: { trees: [{ id: '1', type: 'ciliegio' }, { id: '2', type: 'pesco' }] } })
})
