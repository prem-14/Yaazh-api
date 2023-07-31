const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const connectDB = async () => {
  try {
    // global._pgPool = new Pool({
    //   user: 'postgres',
    //   host: 'localhost',
    //   database: 'Yaazh-api',
    //   // database: 'ecommerce',
    //   password: 'root',
    //   port: 5432,
    //   max: 10, // maximum number of clients the pool should contain by default this is set to 10.
    //   connectionTimeoutMillis: 0,
    //   idleTimeoutMillis: 0,
    // })

    global._pgPool = new Pool({
      user: process.env.POSTGRES_USERNAME,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
      max: 5, // maximum number of clients the pool should contain by default this is set to 10.
      connectionTimeoutMillis: 0,
      idleTimeoutMillis: 0,
    })

    // global._pgPool = new Pool({
    //   connectionString: `postgresql://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`,
    //   ssl: {
    //     rejectUnauthorized: false,
    //     ca: fs.readFileSync(path.join(__dirname, '..', 'ca-certificate.crt')).toString(),
    //   },
    //   max: 10, // maximum number of clients the pool should contain by default this is set to 10.
    //   connectionTimeoutMillis: 0,
    //   idleTimeoutMillis: 0,
    // })

    await _pgPool.query(`set Time ZONE 'UTC';`) // set Time ZONE 'Asia/Calcutta';
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

    const client = await _pgPool.connect()
    client.query('LISTEN pg_notification')
    client.on('notification', ({ payload }) => {
      console.log(JSON.parse(payload))
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = connectDB
