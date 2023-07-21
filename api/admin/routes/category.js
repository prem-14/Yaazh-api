const express = require('express')
const router = express.Router()

const categoryCtrl = require('../controllers/category')

router.route('/addCategory').post(categoryCtrl.addCategory)
router.route('/getAllCategories').post(categoryCtrl.getAllCategories)
router.route('/getCategory').get(categoryCtrl.getCategory)
router.route('/updateCategory').put(categoryCtrl.updateCategory)
router.route('/changeCategoryStatus').patch(categoryCtrl.changeCategoryStatus)

module.exports = router
