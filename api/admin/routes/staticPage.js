const express = require('express')
const router = express.Router()

const staticPageCtrl = require('../controllers/staticPage')

router.route('/addNewStaticPage').post(staticPageCtrl.addNewStaticPage)
router.route('/getAllStaticPages').post(staticPageCtrl.getAllStaticPages)
router.route('/getStaticPage').get(staticPageCtrl.getStaticPage)
router.route('/updateStaticPage').put(staticPageCtrl.updateStaticPage)
router.route('/changeStaticPageStatus').patch(staticPageCtrl.changeStaticPageStatus)

module.exports = router
