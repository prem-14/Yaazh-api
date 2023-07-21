const express = require('express')
const router = express.Router()

const authCtrl = require('../controllers/auth')
// const { adminAuth } = require('../../../middleware/adminAuth')

router.route('/login').post(authCtrl.login)
router.route('/refreshToken').get(authCtrl.refreshToken)
router.route('/logout').post(authCtrl.logout)
router.route('/loadAdmin').get(authCtrl.loadAdmin)
router.route('/forgotPassword').post(authCtrl.forgotPassword)
router.route('/resetPassword').post(authCtrl.resetPassword)
// router.route('/updatePassword').post(adminAuth, authCtrl.updatePassword)
// router.route('/validateAdmin').post(adminAuth, authCtrl.validateAdmin)

module.exports = router
