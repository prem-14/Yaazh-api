const express = require('express')
const router = express.Router()

const dummyCtrl = require('../controllers/dummy')
const {
  getCustomer,
  deleteCustomer,
  updateCustomer,
  changeCustomerStatus,
} = require('../validation/dummy')
const { validate } = require('../../../common/commonFunctions')

router.route('/').post(dummyCtrl.dummy)
router.route('/getAllCustomers').post(dummyCtrl.getAllCustomers)
router.route('/getCustomer').get(validate(getCustomer), dummyCtrl.getCustomer)
router.route('/addCustomer').post(dummyCtrl.addCustomer)
router
  .route('/deleteCustomer')
  .post(validate(deleteCustomer), dummyCtrl.deleteCustomer)
router
  .route('/updateCustomer')
  .post(validate(updateCustomer), dummyCtrl.updateCustomer)
router
  .route('/changeCustomerStatus')
  .post(validate(changeCustomerStatus), dummyCtrl.changeCustomerStatus)

module.exports = router
