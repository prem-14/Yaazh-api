const express = require('express')

const router = express.Router()

const auth = require('./routes/auth')
const dummy = require('./routes/dummy')

router.use('/auth', auth)
router.use('/dummy', dummy)

module.exports = router
