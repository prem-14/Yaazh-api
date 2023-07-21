const logger = require('./logger')
const postgres = require('./postgres')
const initDatabase = require('./initDatabase')
const connections = require('./connections')
const express = require('./express')
const socket = require('./socket')
const routes = require('./routes')
// const cron = require('../cron')

module.exports = async (app) => {
  process
    .on('uncaughtException', (err) => {
      console.error(`exception error==${err}`)
      //   process.exit(1)
    })
    .on('unhandledRejection', (err) => {
      console.error(`rejection error==${err}`)
      //   process.exit(1)
    })
    .on('SIGTERM', () => {
      console.log('SIGTERM received')
      //   process.exit(0)
    })

  logger()
  await postgres()
  await initDatabase()
  await connections(app)
  express(app)
  routes(app)
  socket()
}
