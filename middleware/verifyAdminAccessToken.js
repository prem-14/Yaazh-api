const AppError = require('../common/error')
const jwt = require('jsonwebtoken')

const verifyAdminAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader?.startsWith('Bearer ')) return next(new AppError('Invalid Authorization', 401))
  const token = authHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  req.admin = decoded.id

  next()
}

module.exports = verifyAdminAccessToken
