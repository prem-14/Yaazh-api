const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const blogService = require('../services/blog')

exports.addNewBlog = catchAsync(async (req, res, next) => {
  await blogService.addNewBlog(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Blog added successful',
  })
})

exports.getAllBlogs = catchAsync(async (req, res) => {
  const { records, totalRecords } = await blogService.getAllBlogs(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getBlog = catchAsync(async (req, res) => {
  const { records } = await blogService.getBlog(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateBlog = catchAsync(async (req, res) => {
  const { records } = await blogService.updateBlog(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteBlog = catchAsync(async (req, res) => {
  const { records } = await blogService.deleteBlog(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeBlogStatus = catchAsync(async (req, res) => {
  const { records } = await blogService.changeBlogStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
