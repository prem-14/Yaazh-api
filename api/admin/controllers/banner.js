const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const bannerService = require('../services/banner')

exports.addNewBanner = catchAsync(async (req, res, next) => {
  await bannerService.addNewBanner(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Banner added successful',
  })
})

exports.getAllBanners = catchAsync(async (req, res) => {
  const { records, totalRecords } = await bannerService.getAllBanners(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getBanner = catchAsync(async (req, res) => {
  const { records } = await bannerService.getBanner(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateBanner = catchAsync(async (req, res) => {
  const { records } = await bannerService.updateBanner(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteBanner = catchAsync(async (req, res) => {
  const { records } = await bannerService.deleteBanner(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeBannerStatus = catchAsync(async (req, res) => {
  const { records } = await bannerService.changeBannerStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
