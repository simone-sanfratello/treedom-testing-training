'use strict'

const t = require('tap')

const { sum } = require('../../../lib/sum')

const cases = [
  { input: [1, 2], output: 3 },
  { input: [-1, 2], output: 1 },
  { input: ['a', 'b'], output: 'ab' }
]

for (const c of cases) {
  t.test(`should get ${c.output} on sum ${c.input.join()}`, t => {
    t.plan(1)
    t.equal(sum(...c.input), c.output)
  })
}
