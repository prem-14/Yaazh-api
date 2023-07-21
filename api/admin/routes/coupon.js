const express = require('express')
const router = express.Router()

const couponCtrl = require('../controllers/coupon')

router.route('/addNewCoupon').post(couponCtrl.addNewCoupon)
router.route('/getAllCoupons').post(couponCtrl.getAllCoupons)
router.route('/getCoupon').get(couponCtrl.getCoupon)
router.route('/updateCoupon').put(couponCtrl.updateCoupon)
router.route('/changeCouponStatus').patch(couponCtrl.changeCouponStatus)

module.exports = router
