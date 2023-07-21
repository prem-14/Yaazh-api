const express = require('express')
const router = express.Router()

const configurationCtrl = require('../controllers/configuration')

router.route('/addNewConfiguration').post(configurationCtrl.addNewConfiguration)
router.route('/getAllConfigurations').post(configurationCtrl.getAllConfigurations)
router.route('/getConfiguration').get(configurationCtrl.getConfiguration)
router.route('/updateConfiguration').put(configurationCtrl.updateConfiguration)
router.route('/changeConfigurationStatus').patch(configurationCtrl.changeConfigurationStatus)

module.exports = router
