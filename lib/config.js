'use strict'

const envSchema = require('env-schema')
const S = require('fluent-json-schema')

const config = envSchema({
  schema: S.object()
    .prop('NODE_ENV', S.string().default('development'))

    .prop('DATABASE_HOST', S.string().default('localhost'))
    .prop('DATABASE_PORT', S.number().default(5432))
    .prop('DATABASE_USER', S.string().default('pg'))
    .prop('DATABASE_PASS', S.string().default('none'))
    .prop('DATABASE_NAME', S.string().default('tree')),

  dotenv: true
})

module.exports = {
  env: config.NODE_ENV,
  database: {
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASS,
    database: config.DATABASE_NAME
  }
}
