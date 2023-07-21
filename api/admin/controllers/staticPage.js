const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const staticPageService = require('../services/staticPage')

exports.addNewStaticPage = catchAsync(async (req, res, next) => {
  await staticPageService.addNewStaticPage(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'StaticPage added successful',
  })
})

exports.getAllStaticPages = catchAsync(async (req, res) => {
  const { records, totalRecords } = await staticPageService.getAllStaticPages(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getStaticPage = catchAsync(async (req, res) => {
  const { records } = await staticPageService.getStaticPage(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateStaticPage = catchAsync(async (req, res) => {
  const { records } = await staticPageService.updateStaticPage(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteStaticPage = catchAsync(async (req, res) => {
  const { records } = await staticPageService.deleteStaticPage(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeStaticPageStatus = catchAsync(async (req, res) => {
  const { records } = await staticPageService.changeStaticPageStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
