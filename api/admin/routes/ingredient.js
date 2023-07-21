const express = require('express')
const router = express.Router()

const ingredientCtrl = require('../controllers/ingredient')

router.route('/addNewIngredient').post(ingredientCtrl.addNewIngredient)
router.route('/getAllIngredients').post(ingredientCtrl.getAllIngredients)
router.route('/getIngredient').get(ingredientCtrl.getIngredient)
router.route('/updateIngredient').put(ingredientCtrl.updateIngredient)
router.route('/changeIngredientStatus').patch(ingredientCtrl.changeIngredientStatus)

module.exports = router
