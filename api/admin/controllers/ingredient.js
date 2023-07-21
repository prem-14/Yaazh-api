const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const ingredientService = require('../services/ingredient')

exports.addNewIngredient = catchAsync(async (req, res, next) => {
  await ingredientService.addNewIngredient(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Ingredient added successful',
  })
})

exports.getAllIngredients = catchAsync(async (req, res) => {
  const { records, totalRecords } = await ingredientService.getAllIngredients(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getIngredient = catchAsync(async (req, res) => {
  const { records } = await ingredientService.getIngredient(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateIngredient = catchAsync(async (req, res) => {
  const { records } = await ingredientService.updateIngredient(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteIngredient = catchAsync(async (req, res) => {
  const { records } = await ingredientService.deleteIngredient(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeIngredientStatus = catchAsync(async (req, res) => {
  const { records } = await ingredientService.changeIngredientStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
