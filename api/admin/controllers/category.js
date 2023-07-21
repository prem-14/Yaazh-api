const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const categoryService = require('../services/category')

exports.addCategory = catchAsync(async (req, res, next) => {
  await categoryService.addCategory(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Category added successful',
  })
})

exports.getAllCategories = catchAsync(async (req, res) => {
  const { records, totalRecords } = await categoryService.getAllCategories(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getCategory = catchAsync(async (req, res) => {
  const { records } = await categoryService.getCategory(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateCategory = catchAsync(async (req, res) => {
  const { records } = await categoryService.updateCategory(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteCategory = catchAsync(async (req, res) => {
  const { records } = await categoryService.deleteCategory(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeCategoryStatus = catchAsync(async (req, res) => {
  const { records } = await categoryService.changeCategoryStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
