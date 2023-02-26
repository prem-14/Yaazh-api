const routes = require("../api")
const AppError = require('../common/error')
const globalErrorHandler = require("../middleware/errorHandler")

module.exports = (app) => {

    app.use(['/api/v1'], routes)
    app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });

    app.use(globalErrorHandler);

}
