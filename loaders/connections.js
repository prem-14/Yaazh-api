
module.exports = async (app) => {
    const PORT = process.env.PORT || 5000
    const server = await app.listen(PORT)
    _logger.info(`Server started at port ${PORT}`)

    global._io = require("socket.io")(server, {
        cors: {
            origin: ["http://localhost:8080", "https://admin.socket.io"]
        }
    })
}
