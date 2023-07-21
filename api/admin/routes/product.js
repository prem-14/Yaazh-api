const express = require('express')
const router = express.Router()

const productCtrl = require('../controllers/product')

router.route('/addNewProduct').post(productCtrl.addNewProduct)
router.route('/getAllProducts').post(productCtrl.getAllProducts)
router.route('/getProduct').get(productCtrl.getProduct)
router.route('/updateProduct').put(productCtrl.updateProduct)
router.route('/changeProductStatus').patch(productCtrl.changeProductStatus)
router.route('/changeProductDiscount').patch(productCtrl.changeProductDiscount)

module.exports = router
