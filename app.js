const express = require('express')
const loaders = require('./loaders/index')
const dotenv = require('dotenv')
dotenv.config({ path: './.env.local' })

const startServer = () => {
  const app = express()
  loaders(app)
}

startServer()

// global variables are declared using _variablename (eg: _pgPool)
