const { Pool } = require('pg')

const connectDB = async () => {
  try {
    global._pgPool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'ecommerce',
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
      idleTimeoutMillis: 0,
    })

    // set Time ZONE 'Asia/Calcutta';
    // set Time ZONE 'UTC';

    await _pgPool.query(`set Time ZONE 'UTC';`)
    const { rows } = await _pgPool.query('SHOW time zone;')
    console.log(rows)

    _pgPool.on('acquire', function (client) {
      // _logger.info(`PG client is acquired. ID: ${client.processID}`)
    })

    _pgPool.on('connect', function (client) {
      // _logger.info(`PG client is connected. ID: ${client.processID}`)
    })

    _pgPool.on('error', function (error, client) {
      _logger.error(`Unexpected error on idle client ID: ${client.processID} \n ${error}`)
      process.exit(-1)
    })

    _pgPool.on('release', function (client) {
      console.log('client is released back into the pool')
    })

    _pgPool.on('remove', function (client) {
      console.log('client is closed & removed from the pool')
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = connectDB
