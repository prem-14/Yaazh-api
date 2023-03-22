const express = require('express')
const cors = require('cors')

module.exports = async (app) => {
  app.use(cors())
  app.use(express.json())
}
