const express = require('express')
const router = express.Router()

const uploadCtrl = require('../controllers/upload')

router.route('/uploadImages').post(uploadCtrl.uploadImages)
router.route('/deleteImages').post(uploadCtrl.deleteImages)

module.exports = router
