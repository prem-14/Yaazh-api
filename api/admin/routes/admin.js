const express = require('express')
const verifyJWT = require('../../../middleware/verifyAdminAccessToken')
const router = express.Router()

const adminCtrl = require('../controllers/admin')

router.route('/addNewAdmin').post(adminCtrl.addNewAdmin)
router.route('/updateAdmin').put(adminCtrl.updateAdmin)
router.route('/getAllAdmins').post(adminCtrl.getAllAdmins)
// router.route('/getAllAdmins').post(verifyJWT, adminCtrl.getAllAdmins)
router.route('/getAdmin').get(adminCtrl.getAdmin)
router.route('/changeAdminStatus').patch(adminCtrl.changeAdminStatus)

module.exports = router
