const logger = require("./logger")
const postgres = require("./postgres")
const connections = require("./connections")
const socket = require("./socket")
const routes = require("./routes")

module.exports = async (app) => {
    logger()
    await postgres()
    await connections(app)
    routes(app)
    socket()
}