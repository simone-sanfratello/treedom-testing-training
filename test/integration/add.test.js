'use strict'

const t = require('tap')

let fastify

t.before(async () => {
  const { app } = require('../../app')
  fastify = app()
})

t.teardown(async () => {
  await fastify.close()
})

t.test('should get proper result on add query', async (t) => {
  // act
  const query = '{ add(x: 2, y: 2) }'
  const response = await fastify.inject({
    method: 'POST',
    url: '/graphql',
    body: { query }
  })

  // assert
  t.same(JSON.parse(response.body), { data: { add: 4 } })
})
