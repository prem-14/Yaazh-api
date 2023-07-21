const express = require('express')
const router = express.Router()

const authCtrl = require('../controllers/auth')

router.route('/login').post(authCtrl.login)
router.route('/register').post(authCtrl.register)
router.route('/registerVerify').get(authCtrl.registerVerify)
router.route('/googleLogin').post(authCtrl.googleLogin)
router.route('/refreshToken').post(authCtrl.refreshToken)

module.exports = router
