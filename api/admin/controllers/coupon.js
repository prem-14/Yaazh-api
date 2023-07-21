const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const couponService = require('../services/coupon')

exports.addNewCoupon = catchAsync(async (req, res, next) => {
  await couponService.addNewCoupon(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Coupon added successful',
  })
})

exports.getAllCoupons = catchAsync(async (req, res) => {
  const { records, totalRecords } = await couponService.getAllCoupons(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getCoupon = catchAsync(async (req, res) => {
  const { records } = await couponService.getCoupon(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateCoupon = catchAsync(async (req, res) => {
  const { records } = await couponService.updateCoupon(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteCoupon = catchAsync(async (req, res) => {
  const { records } = await couponService.deleteCoupon(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeCouponStatus = catchAsync(async (req, res) => {
  const { records } = await couponService.changeCouponStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
