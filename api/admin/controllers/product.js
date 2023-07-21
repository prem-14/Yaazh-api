const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const productService = require('../services/product')

exports.addNewProduct = catchAsync(async (req, res, next) => {
  await productService.addNewProduct(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Product added successful',
  })
})

exports.getAllProducts = catchAsync(async (req, res) => {
  const { records, totalRecords } = await productService.getAllProducts(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getProduct = catchAsync(async (req, res) => {
  const { records } = await productService.getProduct(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateProduct = catchAsync(async (req, res) => {
  const { records } = await productService.updateProduct(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteProduct = catchAsync(async (req, res) => {
  const { records } = await productService.deleteProduct(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeProductStatus = catchAsync(async (req, res) => {
  const { records } = await productService.changeProductStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})

exports.changeProductDiscount = catchAsync(async (req, res) => {
  const { records } = await productService.changeProductDiscount(req)

  jsonResponse(res, 200, 'success', {
    message: 'Discount Changed successful',
    responseData: { records },
  })
})
