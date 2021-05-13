const path = require('path')
const Docker = require('dockerode')
const DB_IMAGE_NAME = 'treedom/test'

const helper = {
    container: undefined,

    async startDatabase({
        host = process.env.DB_HOST,
        port = process.env.DB_PORT,
        user = process.env.DB_USER,
        pass = process.env.DB_PASS,
        db = process.env.DB_DB
    }) {
        try {
            const docker = new Docker()

            const containers = await docker.listContainers({ all: true })
            helper.container = containers.find(c => c.Image == DB_IMAGE_NAME)
            if (helper.container) {
                helper.container = await docker.getContainer(helper.container.Id)
            } else {
                const s = await docker.buildImage({
                    context: path.join(__dirname, '..'),
                    dockerfile: 'Dockerfile-db'
                }, { t: DB_IMAGE_NAME })
                await new Promise((resolve, reject) => {
                    docker.modem.followProgress(s, (err, res) => err ? reject(err) : resolve(res))
                })
                helper.container = await docker.createContainer({
                    Image: DB_IMAGE_NAME,
                    name: 'testing-tree',
                    Env: [
                        `POSTGRES_DB=${db}`,
                        `POSTGRES_USER=${user}`,
                        `POSTGRES_PASSWORD=${pass}`
                    ],
                    PortBindings: { '5432/tcp': [{ HostPort: port }] }
                })
            }
            const info = await helper.container.inspect()
            if (info && info.State.Status != 'running') {
                await helper.container.start()
            }
        } catch (error) {
            console.error(error)
            throw new Error('cant start db container')
        }
    },

    async stopDatabase() {
        await helper.container.stop()
    }
}

module.exports = helper
