'use strict'

const { promisify } = require('util')
const Docker = require('dockerode')
const { Client } = require('pg')

const DB_IMAGE_NAME = 'treedom/test'
const DB_CONTAINER_NAME = 'testing-tree'

const helper = {
  container: undefined,
  client: undefined,

  sleep: promisify(setTimeout),

  async startDatabase ({ host, port, user, password, database }) {
    try {
      const docker = new Docker()

      const containers = await docker.listContainers({ all: true })
      helper.container = containers.find(c => c.Names.includes('/' + DB_CONTAINER_NAME))
      if (helper.container) {
        helper.container = await docker.getContainer(helper.container.Id)
      } else {
        const s = await docker.buildImage({
          context: __dirname,
          dockerfile: 'Dockerfile'
        }, { t: DB_IMAGE_NAME })
        await new Promise((resolve, reject) => {
          docker.modem.followProgress(s, (err, res) => err ? reject(err) : resolve(res))
        })
        helper.container = await docker.createContainer({
          Image: DB_IMAGE_NAME,
          name: DB_CONTAINER_NAME,
          Env: [
                        `POSTGRES_DB=${database}`,
                        `POSTGRES_USER=${user}`,
                        `POSTGRES_PASSWORD=${password}`
          ],
          PortBindings: { '5432/tcp': [{ HostPort: String(port) }] }
        })
      }
      const info = await helper.container.inspect()
      if (info && info.State.Status != 'running') {
        await helper.container.start()
        // console.log('container started')
      }
    } catch (error) {
      console.error(error)
      throw new Error('cant start db container')
    }

    // container sometimes need time to be ready
    let attempts = 1
    let failed
    do {
      failed = false
      try {
        helper.client = new Client({ host, port, user, password, database })
        await helper.client.connect()
      } catch (error) {
        failed = true
        // console.log(`connection attempt #${attempts}`)
        attempts++
        await helper.sleep(500)
      }
    } while (failed && attempts <= 10)
  },

  async stopDatabase () {
    await helper.client.end()
    await helper.container.stop()
  },

  async fillTableTrees (data) {
    await helper.client.query('DELETE FROM trees')

    const insert = []
    const values = []
    let p = 1
    for (const row of data) {
      const placeholds = []

      placeholds.push(`$${p++}`)
      values.push(row.id)

      placeholds.push(`$${p++}`)
      values.push(row.type)

      insert.push(`(${placeholds.join()})`)
    }

    await helper.client.query('INSERT INTO trees (id, "type") VALUES ' + insert.join(), values)
  }
}

module.exports = helper
