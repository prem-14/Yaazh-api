const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const globalServices = require('../services/global')

exports.allValues = catchAsync(async (req, res) => {
  const records = await globalServices.allValues(req)

  jsonResponse(res, 200, 'success', {
    message: 'All values retreived successful',
    responseData: { records },
  })
})
