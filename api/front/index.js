const express = require('express')

const router = express.Router()

const auth = require("./routes/auth")

router.use('/auth', auth)

module.exports = router
