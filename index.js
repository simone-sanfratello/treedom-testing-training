'use strict'

process.env.DB_HOST = 'localhost'
process.env.DB_PORT = 5432
process.env.DB_USER = 'pg'
process.env.DB_PASS = 'none'
process.env.DB_DB = 'tree'

const { start } = require('./app')

start()
