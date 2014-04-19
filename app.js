var net = require('net')

var server = net.Server()

server.listen(1337)

var sockets = []

server.on('connection', function(socket) {
  sockets.push(socket)

  socket.write('Hello and welcome to PandaChat!\n')
})