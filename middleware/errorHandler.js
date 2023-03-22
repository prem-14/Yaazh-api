const AppError = require('../common/error')
const { jsonResponse, errorResponse } = require('../common/response')

const sendErrorDev = (err, req, res) => {
  jsonResponse(res, err.statusCode || 500, err.status, {
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    jsonResponse(res, err.statusCode, err.status, {
      message: err.message,
    })
  }

  errorResponse(err, res)
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  console.log(err.name)
  if (err.name === 'ValidationError') err = handleValidationErrorDB(err)

  if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, req, res)
  } else {
    sendErrorDev(err, req, res)
  }
}

function handleValidationErrorDB(err) {
  //body.id is a required field
  const message = err.message.slice(err.message.indexOf('.') + 1) // id is a required field
  return new AppError(message, 400)
}
