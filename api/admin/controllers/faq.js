const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const faqService = require('../services/faq')

exports.addNewFaq = catchAsync(async (req, res, next) => {
  await faqService.addNewFaq(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'Faq added successful',
  })
})

exports.getAllFaqs = catchAsync(async (req, res) => {
  const { records, totalRecords } = await faqService.getAllFaqs(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records, totalRecords },
  })
})

exports.getFaq = catchAsync(async (req, res) => {
  const { records } = await faqService.getFaq(req)

  jsonResponse(res, 200, 'success', {
    message: 'retreived successful',
    responseData: { records },
  })
})

exports.updateFaq = catchAsync(async (req, res) => {
  const { records } = await faqService.updateFaq(req)

  jsonResponse(res, 200, 'success', {
    message: 'updated successful',
    responseData: { records },
  })
})

exports.deleteFaq = catchAsync(async (req, res) => {
  const { records } = await faqService.deleteFaq(req)

  jsonResponse(res, 200, 'success', {
    message: 'deleted successful',
    responseData: { records },
  })
})

exports.changeFaqStatus = catchAsync(async (req, res) => {
  const { records } = await faqService.changeFaqStatus(req)

  jsonResponse(res, 200, 'success', {
    message: 'Status Changed successful',
    responseData: { records },
  })
})
