

module.exports = () => {
    global._adminIo = _io.of("/admin") // admin namespace
    _adminIo.on("connection", socket => {
        logger.info(`Connected to admin namespace with id: ${socket.id}`)
    })

    global._userIo = _io.of("/user") // user namespace
    _userIo.on("connection", socket => {
        logger.info(`Connected to user namespace with id: ${socket.id}`)
    })
}