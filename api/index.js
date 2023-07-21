const express = require('express')
const front = require('./front')
const admin = require('./admin')
const common = require('./common')

const router = express.Router()

router.use('/admin', admin)
router.use('/front', front)
router.use('/common', common)

module.exports = router
