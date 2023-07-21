const express = require('express')
const router = express.Router()

const badgeCtrl = require('../controllers/badge')

router.route('/addNewBadge').post(badgeCtrl.addNewBadge)
router.route('/getAllBadges').post(badgeCtrl.getAllBadges)
router.route('/getBadge').get(badgeCtrl.getBadge)
router.route('/updateBadge').put(badgeCtrl.updateBadge)
router.route('/changeBadgeStatus').patch(badgeCtrl.changeBadgeStatus)

module.exports = router
