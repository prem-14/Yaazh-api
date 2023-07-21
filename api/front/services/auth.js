const { pgTableColumns } = require('../../../common/columns')
const { generateColumns, generateInsertData } = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { OAuth2Client } = require('google-auth-library')
const jwt_decode = require('jwt-decode')
const { sendEmail } = require('../../../utils/email')

exports.register = async (req) => {
  if (!req.body.email || !req.body.password) {
    throw new AppError('Please provide an email and password', 400)
  }

  req.body.password = await bcrypt.hash(req.body.password, 10)

  const {
    rows: [isCustomerExists],
  } = await _pgPool.query('Select email from customer where email=$1', [req.body.email])

  if (isCustomerExists) {
    throw new AppError('Customer email already exists.', 400)
  }

  const registerToken = crypto.randomBytes(32).toString('hex')

  req.body.registertoken = crypto.createHash('sha256').update(registerToken).digest('hex')
  req.body.registertokenexpire = new Date(Date.now() + 10 * 60 * 1000)

  const customerConfigs = generateColumns(pgTableColumns['cus_1'])
  const { columns, exp, values } = generateInsertData(customerConfigs, req.body)

  const {
    rows: [newCustomer],
  } = await _pgPool.query(
    `
          INSERT INTO "customer" (${columns}) VALUES (${exp}) RETURNING "first_name", "email";
          `,
    [...values]
  )

  const {
    rows: [customerTemplate],
  } = await _pgPool.query("Select subject, template, active from template where title = 'customer_register'")

  if (customerTemplate && customerTemplate.active) {
    let { subject, template } = customerTemplate

    template = template.replace(/{{customername}}/g, newCustomer.first_name)
    template = template.replace(/{{verifyurl}}/g, `${process.env.FRONTEND_URL}/registerVerify/${registerToken}`)

    sendEmail(subject, newCustomer.email, template)
  }
}

exports.registerVerify = async (req) => {
  const { verify_token } = req.query

  if (!verify_token) {
    throw new AppError('Invalid url', 401)
  }

  const hashedToken = crypto.createHash('sha256').update(verify_token).digest('hex')

  const {
    rows: [customer],
  } = await _pgPool.query(`Select id from customer where registertoken=$1 and registertokenexpire >= $2`, [
    hashedToken,
    new Date(),
  ])

  if (!customer) {
    throw new AppError('Your verify url is expired or it is an invalid url', 401)
  }

  await _pgPool.query('Update customer set status=$1, registertoken=$2, registertokenexpire=$3 where id=$4 ', [
    'verified',
    null,
    null,
    customer.id,
  ])

  return customer
}

exports.login = async (req, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }

  const { arrayColumns } = generateColumns(pgTableColumns['cus_3'])

  const {
    rows: [customer],
  } = await _pgPool.query(`Select ${arrayColumns} from customer where email = $1`, [email])

  if (customer && customer.status === 'unverified') {
    return next(new AppError('Account is not verified', 401))
  }

  if (!customer || !(await bcrypt.compare(password, customer.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  await _pgPool.query(`Update customer set lastlogin = $1`, [new Date()])

  delete customer.password
  return { accessToken, refreshToken, customer }
}

exports.googleLogin = async (req, next) => {
  if (!req.body.google_code) {
    return next(new AppError('Necessary data is not provided', 500))
  }

  console.log(process.env.GOOGLE_CLIENTID, process.env.GOOGLE_SECRET)
  const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENTID, process.env.GOOGLE_SECRET, 'postmessage')

  const { tokens } = await oAuth2Client.getToken(req.body.google_code) // exchange code for tokens
  console.log(tokens)
  const customerInfo = jwt_decode(tokens.id_token)
  console.log(customerInfo)

  if (customerInfo && !customerInfo.email_verified) {
    throw new AppError('Email is not verified', 400)
  }

  const {
    rows: [customer],
  } = await _pgPool.query('Select id from customer where google_id = $1', [customerInfo.email])

  let customer_id

  if (customer) {
    customer_id = customer.id
    await _pgPool.query(`Update customer set lastlogin = $1`, [new Date()])
  } else {
    req.body.google_id = customerInfo.email
    req.body.first_name = customerInfo.given_name
    req.body.last_name = customerInfo.family_name
    req.body.status = 'verified'
    req.body.lastlogin = new Date()

    const customerConfigs = generateColumns(pgTableColumns['cus_1A'])
    const { columns, exp, values } = generateInsertData(customerConfigs, req.body)
    const {
      rows: [newCustomer],
    } = await _pgPool.query(
      `
              INSERT INTO "customer" (${columns}) VALUES (${exp}) RETURNING id
              `,
      [...values]
    )
    customer_id = newCustomer.id
  }
  const accessToken = jwt.sign({ id: customer_id }, process.env.USER_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
  })

  const refreshToken = jwt.sign({ id: customer_id }, process.env.USER_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.USER_REFRESH_TOKEN_EXPIRES_IN,
  })
  return { accessToken, refreshToken }
}

exports.refreshToken = async (req, next) => {
  const cookies = req.cookies
  console.log('refreshToken', JSON.stringify(cookies))
  if (!cookies?.refreshToken) return next(new AppError('Refresh token not found', 401))
  const refreshToken = cookies.refreshToken

  const decoded = jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET)

  const {
    rows: [customer],
  } = await _pgPool.query(`SELECT email FROM customer WHERE id = ${decoded.id}`)

  if (!customer) next(new AppError('Customer not found', 401))

  const accessToken = jwt.sign({ id: customer.id }, process.env.USER_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
  })
  return { accessToken }
}

exports.logout = async (req, res, next) => {
  // On client, also delete the accessToken

  const cookies = req.cookies
  console.log(cookies)
  if (!cookies?.refreshToken) return res.sendStatus(204)
}

exports.loadCustomer = async (req, next) => {
  const cookies = req.cookies
  if (!cookies?.refreshToken) return next(new AppError('Refresh token not found', 401))

  const refreshToken = cookies.refreshToken

  const decoded = jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET)

  const { arrayColumns } = generateColumns(pgTableColumns['adm_3'])

  const {
    rows: [customer],
  } = await _pgPool.query(`Select ${arrayColumns} from customer where id = $1`, [decoded.id])

  if (!customer) next(new AppError('Customer not found', 401))

  const accessToken = jwt.sign({ id: customer.id }, process.env.USER_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
  })
  return { accessToken, customer }
}
