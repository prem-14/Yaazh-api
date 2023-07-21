const express = require('express')
const router = express.Router()

const discountCtrl = require('../controllers/discount')

router.route('/addNewDiscount').post(discountCtrl.addNewDiscount)
router.route('/getAllDiscounts').post(discountCtrl.getAllDiscounts)
router.route('/getDiscount').get(discountCtrl.getDiscount)
router.route('/updateDiscount').put(discountCtrl.updateDiscount)

module.exports = router
