const express = require('express')
const router = express.Router()

const bannerCtrl = require('../controllers/banner')

router.route('/addNewBanner').post(bannerCtrl.addNewBanner)
router.route('/getAllBanners').post(bannerCtrl.getAllBanners)
router.route('/getBanner').get(bannerCtrl.getBanner)
router.route('/updateBanner').put(bannerCtrl.updateBanner)
router.route('/changeBannerStatus').patch(bannerCtrl.changeBannerStatus)

module.exports = router
