const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const adminServices = require('../services/admin')

exports.addNewAdmin = catchAsync(async (req, res, next) => {
  await adminServices.addNewAdmin(req)

  jsonResponse(res, 200, 'success', {
    message: `Admin created successfully.`,
  })
})

exports.getAllAdmins = catchAsync(async (req, res) => {
  const { records, totalRecords } = await adminServices.getAllAdmins(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getAdmin = catchAsync(async (req, res) => {
  const { records } = await adminServices.getAdmin(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateAdmin = catchAsync(async (req, res) => {
  const { records } = await adminServices.updateAdmin(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteAdmin = catchAsync(async (req, res) => {
  const { records } = await adminServices.deleteAdmin(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeAdminStatus = catchAsync(async (req, res) => {
  const { records } = await adminServices.changeAdminStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
