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

exports.googleLogin = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken } = await authService.googleLogin(req, next)

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    // secure: process.env.ENVIRONMENT === 'local' ? false : true,
    // secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
  })

  jsonResponse(res, 200, 'success', {
    message: 'Login successful',
    accessToken,
  })
})

exports.register = catchAsync(async (req, res) => {
  await authService.register(req)

  jsonResponse(res, 200, 'success', {
    message: 'Customer Registered successful. Check email',
  })
})

exports.registerVerify = catchAsync(async (req, res) => {
  await authService.registerVerify(req)

  jsonResponse(res, 200, 'success', {
    message: 'Email has been verified',
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

exports.loadCustomer = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken, admin } = await authService.loadCustomer(req, next)

  jsonResponse(res, 200, 'success', {
    message: 'customer loaded successful',
    accessToken,
    admin,
  })
})

exports.updatePassword = catchAsync(async (req, res, next) => {})

exports.forgotPassword = catchAsync(async (req, res, next) => {})

exports.resetPassword = catchAsync(async (req, res, next) => {})
