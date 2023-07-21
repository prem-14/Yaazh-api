const express = require('express')
const router = express.Router()

const globalCtrl = require('../controllers/global')

router.route('/allValues').get(globalCtrl.allValues)

module.exports = router
