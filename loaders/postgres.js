const { Pool } = require('pg')

const connectDB = async () => {
    try {
        global.pgPoolAcquiredCount = 0
        global.pgPoolConnectedCount = 0
        global.pgPool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'Yaazh_test',
            password: 'root',
            port: 5432,

            // maximum number of clients the pool should contain
            // by default this is set to 10.
            max: 10,

            // number of milliseconds to wait before timing out when connecting a new client
            // by default this is 0 which means no timeout
            connectionTimeoutMillis: 0,

            // number of milliseconds a client must sit idle in the pool and not be checked out
            // before it is disconnected from the backend and discarded
            // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
            idleTimeoutMillis: 0
        })

        pgPool.on('acquire', function (client) {
            pgPoolAcquiredCount++
            logger.info(`PG client is acquired. ID: ${client.processID}`)
        })

        pgPool.on('connect', function (client) {
            pgPoolConnectedCount++
            logger.info(`PG client is connected. ID: ${client.processID}`)
        })

        pgPool.on('error', function (error, client) {
            logger.error(`Unexpected error on idle client ID: ${client.processID} \n ${error}`)
            process.exit(-1)
        })


    } catch (error) {
        throw new Error(error.message)
    }

}

module.exports = connectDB