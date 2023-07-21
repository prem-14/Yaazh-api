const express = require('express')
const router = express.Router()

const templateCtrl = require('../controllers/template')

router.route('/addNewTemplate').post(templateCtrl.addNewTemplate)
router.route('/getAllTemplates').post(templateCtrl.getAllTemplates)
router.route('/getTemplate').get(templateCtrl.getTemplate)
router.route('/updateTemplate').put(templateCtrl.updateTemplate)
router.route('/changeTemplateStatus').patch(templateCtrl.changeTemplateStatus)

module.exports = router
