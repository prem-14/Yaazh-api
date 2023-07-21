module.exports = async (app) => {
  const PORT = process.env.PORT || 5000
  const server = await app.listen(PORT)
  _logger.info(`Server started at port ${PORT}`)

  global._io = require('socket.io')(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, 'https://admin.socket.io'],
    },
  })
}
