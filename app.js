const express = require('express')
const loaders = require('./loaders/index')

const startServer = () => {
  const app = express()
  loaders(app)
}

startServer()

// global variables are declared using _variablename
