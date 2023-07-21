const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const configurationService = require('../services/configuration')

exports.addNewConfiguration = catchAsync(async (req, res, next) => {
  await configurationService.addNewConfiguration(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Configuration added successful',
  })
})

exports.getAllConfigurations = catchAsync(async (req, res) => {
  const { records, totalRecords } = await configurationService.getAllConfigurations(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getConfiguration = catchAsync(async (req, res) => {
  const { records } = await configurationService.getConfiguration(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateConfiguration = catchAsync(async (req, res) => {
  const { records } = await configurationService.updateConfiguration(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteConfiguration = catchAsync(async (req, res) => {
  const { records } = await configurationService.deleteConfiguration(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeConfigurationStatus = catchAsync(async (req, res) => {
  const { records } = await configurationService.changeConfigurationStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
