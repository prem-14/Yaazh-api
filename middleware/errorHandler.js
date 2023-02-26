const AppError = require('../common/error');
const { jsonResponse, errorResponse } = require("../common/response")


const sendErrorDev = (err, req, res) => {
    jsonResponse(res, err.statusCode || 500, err.status, {
        error: err,
        message: err.message,
        stack: err.stack
    })
};

const sendErrorProd = (err, req, res) => {

    if (err.isOperational) {
        jsonResponse(res, err.statusCode, err.status, {
            message: err.message,
        })
    }

    errorResponse(err, res)

};

module.exports = (err, req, res, next) => {
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err };
    error.message = err.message;

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(error, req, res);
    }
};
