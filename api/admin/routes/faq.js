const express = require('express')
const router = express.Router()

const faqCtrl = require('../controllers/faq')

router.route('/addNewFaq').post(faqCtrl.addNewFaq)
router.route('/getAllFaqs').post(faqCtrl.getAllFaqs)
router.route('/getFaq').get(faqCtrl.getFaq)
router.route('/updateFaq').put(faqCtrl.updateFaq)
router.route('/changeFaqStatus').patch(faqCtrl.changeFaqStatus)

module.exports = router
