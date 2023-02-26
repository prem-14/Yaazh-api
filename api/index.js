const express = require('express')
const front = require('./front')
const admin = require('./admin')

const router = express.Router()

router.use('/admin', admin)
router.use('/front', front)

module.exports = router
