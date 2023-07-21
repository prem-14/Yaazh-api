const express = require('express')

const app = express.Router()

const uploads = require('./routes/uploads')
const global = require('./routes/global')

app.use('/uploads', uploads)
app.use('/global', global)

module.exports = app
