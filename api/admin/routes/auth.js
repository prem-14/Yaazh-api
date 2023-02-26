const express = require("express")
const router = express.Router()

const authCtrl = require('../controllers/auth')

router.route('/register').post(authCtrl.login)

module.exports = router