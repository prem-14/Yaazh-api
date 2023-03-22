const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const dummyService = require('../services/dummy')

exports.dummy = catchAsync(async (req, res) => {
  const { records, totalRecords } = await dummyService.dummy(req)

  jsonResponse(res, 200, 'success', {
    message: 'dummy successful',
    responseData: { records, totalRecords },
  })
})

exports.getAllCustomers = catchAsync(async (req, res) => {
  const { records, totalRecords } = await dummyService.getAllCustomers(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getCustomer = catchAsync(async (req, res) => {
  const { records } = await dummyService.getCustomer(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.addCustomer = catchAsync(async (req, res) => {
  const { records } = await dummyService.addCustomer(req)

  jsonResponse(res, 200, 'success', {
    message: 'added successful',
    responseData: { records },
  })
})

exports.updateCustomer = catchAsync(async (req, res) => {
  const { records } = await dummyService.updateCustomer(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteCustomer = catchAsync(async (req, res) => {
  const { records } = await dummyService.deleteCustomer(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeCustomerStatus = catchAsync(async (req, res) => {
  const { records } = await dummyService.changeCustomerStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
