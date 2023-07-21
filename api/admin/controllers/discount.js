const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const discountService = require('../services/discount')

exports.addNewDiscount = catchAsync(async (req, res, next) => {
  await discountService.addNewDiscount(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Discount added successful',
  })
})

exports.getAllDiscounts = catchAsync(async (req, res) => {
  const { records, totalRecords } = await discountService.getAllDiscounts(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getDiscount = catchAsync(async (req, res) => {
  const { records } = await discountService.getDiscount(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateDiscount = catchAsync(async (req, res) => {
  await discountService.updateDiscount(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
  })
})

exports.deleteDiscount = catchAsync(async (req, res) => {
  const { records } = await discountService.deleteDiscount(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})
