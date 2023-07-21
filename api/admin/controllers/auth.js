const { catchAsync } = require('../../../common/commonFunctions')
const { jsonResponse } = require('../../../common/response')
const authService = require('../services/auth')

exports.login = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken, admin } = await authService.login(req, next)

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    // secure: process.env.ENVIRONMENT === 'local' ? false : true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
  })

  jsonResponse(res, 200, 'success', {
    message: 'Login successful',
    accessToken,
    admin,
  })
})

exports.refreshToken = catchAsync(async (req, res, next) => {
  const { accessToken } = await authService.refreshToken(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'refresh token successful',
    accessToken,
  })
})

exports.logout = catchAsync(async (req, res, next) => {
  await authService.logout(req, res, next)

  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true })

  jsonResponse(res, 200, 'success', {
    message: 'logout successful',
  })
})

exports.loadAdmin = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken, admin } = await authService.loadAdmin(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'admin loaded successful',
    accessToken,
    admin,
  })
})

exports.updatePassword = catchAsync(async (req, res, next) => {})

exports.forgotPassword = catchAsync(async (req, res, next) => {})

exports.resetPassword = catchAsync(async (req, res, next) => {})

exports.validateAdmin = catchAsync(async (req, res, next) => {})
