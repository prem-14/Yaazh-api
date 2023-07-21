const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const templateService = require('../services/template')

exports.addNewTemplate = catchAsync(async (req, res, next) => {
  await templateService.addNewTemplate(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Template added successful',
  })
})

exports.getAllTemplates = catchAsync(async (req, res) => {
  const { records, totalRecords } = await templateService.getAllTemplates(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getTemplate = catchAsync(async (req, res) => {
  const { records } = await templateService.getTemplate(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateTemplate = catchAsync(async (req, res) => {
  const { records } = await templateService.updateTemplate(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteTemplate = catchAsync(async (req, res) => {
  const { records } = await templateService.deleteTemplate(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeTemplateStatus = catchAsync(async (req, res) => {
  const { records } = await templateService.changeTemplateStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
