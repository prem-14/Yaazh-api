

module.exports = () => {
    global.adminIo = io.of("/admin") // admin namespace
    adminIo.on("connection", socket => {
        logger.info(`Connected to admin namespace with id: ${socket.id}`)
    })

    global.userIo = io.of("/user") // user namespace
    userIo.on("connection", socket => {
        logger.info(`Connected to user namespace with id: ${socket.id}`)
    })
}