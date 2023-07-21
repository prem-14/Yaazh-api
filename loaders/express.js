const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const credentials = require('../middleware/credentials')
const corsOptions = require('../config/corsOptions')
const fileUpload = require('express-fileupload')

module.exports = async (app) => {
  app.use(credentials)
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(cookieParser())
  app.use(
    fileUpload({
      useTempFiles: true,
    })
  )
}
