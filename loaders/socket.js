module.exports = () => {
  global._adminIo = _io.of('/admin') // admin namespace
  _adminIo.on('connection', (socket) => {
    global._adminSocket = socket
    _adminSocket.emit('welcome', 'welcome to the team')
    _logger.info(`Connected to admin namespace with id: ${_adminSocket.id}`)
  })

  global._userIo = _io.of('/user') // user namespace
  _userIo.on('connection', (socket) => {
    _logger.info(`Connected to user namespace with id: ${socket.id}`)
  })
}
