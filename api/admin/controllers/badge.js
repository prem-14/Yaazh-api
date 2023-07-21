const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const badgeService = require('../services/badge')

exports.addNewBadge = catchAsync(async (req, res, next) => {
  await badgeService.addNewBadge(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Badge added successful',
  })
})

exports.getAllBadges = catchAsync(async (req, res) => {
  const { records, totalRecords } = await badgeService.getAllBadges(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getBadge = catchAsync(async (req, res) => {
  const { records } = await badgeService.getBadge(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateBadge = catchAsync(async (req, res) => {
  const { records } = await badgeService.updateBadge(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteBadge = catchAsync(async (req, res) => {
  const { records } = await badgeService.deleteBadge(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeBadgeStatus = catchAsync(async (req, res) => {
  const { records } = await badgeService.changeBadgeStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
