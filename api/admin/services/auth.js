const { pgTableColumns } = require('../../../common/columns')
const { generateColumns } = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.login = async (req, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }

  const { arrayColumns } = generateColumns(pgTableColumns['adm_3'])

  const {
    rows: [admin],
  } = await _pgPool.query(`Select ${arrayColumns} from admin where email = $1`, [email])

  if (admin && admin.status === 'inactive') {
    return next(new AppError('Account has been deactivated', 401))
  }

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  const accessToken = jwt.sign({ id: admin.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  })

  const refreshToken = jwt.sign({ id: admin.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  })

  await _pgPool.query(`Update admin set lastlogin = $1`, [new Date()])

  delete admin.password
  return { accessToken, refreshToken, admin }
}

exports.refreshToken = async (req, next) => {
  const cookies = req.cookies
  console.log('refreshToken', JSON.stringify(cookies))
  if (!cookies?.refreshToken) return next(new AppError('Refresh token not found', 401))
  const refreshToken = cookies.refreshToken

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

  const {
    rows: [admin],
  } = await _pgPool.query(`SELECT email FROM admin WHERE id = ${decoded.id}`)

  if (!admin) next(new AppError('Admin not found', 401))

  const accessToken = jwt.sign({ id: admin.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  })
  return { accessToken }
}

exports.logout = async (req, res, next) => {
  // On client, also delete the accessToken

  const cookies = req.cookies
  console.log(cookies)
  if (!cookies?.refreshToken) return res.sendStatus(204)
}

exports.loadAdmin = async (req, next) => {
  const cookies = req.cookies
  if (!cookies?.refreshToken) return next(new AppError('Refresh token not found', 401))

  const refreshToken = cookies.refreshToken

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

  const { arrayColumns } = generateColumns(pgTableColumns['adm_3'])

  const {
    rows: [admin],
  } = await _pgPool.query(`Select ${arrayColumns} from admin where id = $1`, [decoded.id])

  if (!admin) next(new AppError('Admin not found', 401))

  const accessToken = jwt.sign({ id: admin.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  })
  return { accessToken, admin }
}
