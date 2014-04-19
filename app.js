var net = require('net')

var server = net.Server()

server.listen(1337)

var sockets = []

server.on('connection', function(socket) {
  sockets.push(socket)

  socket.write('Hello and welcome to PandaChat!\n')

  socket.on('data', function(data) {
    for (var i = 0; i < sockets.length; i ++) {
      if (sockets[i] !== this) { sockets[i].write(data) }
    }
  })

  socket.on('end', function() {
    var i = sockets.indexOf(this)
    sockets.splice(i, 1)
  })
})