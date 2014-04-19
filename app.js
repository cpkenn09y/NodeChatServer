var parser = require('./parser')
var net = require('net')

var server = net.Server()

server.listen(1337)

var sockets = []

server.on('connection', function(socket) {
  socket.room = "home"
  sockets.push(socket)

  sendGreeting(socket)
  askName(socket)

  socket.on('data', determineAction)
  socket.on('end', removeSocket)
})

function sendGreeting(socket) {
  socket.write("Hello and welcome to PandaChat!\n")
}

function askName(socket) {
  socket.write("What would you like your username to be??\n")
}

function nameTaken(socket) {
  socket.write("Sorry, but that name is taken. Please try again.\n")
  askName(socket)
}

function welcomeUser(socket) {
  socket.write("Welcome " + socket.username + "! You are among friends.\n")
}

function determineAction(data) {
  var currentSocket = this
  var userInput = data.toString().trim()
  if (currentSocket.username) {
    var verdict = parser.analyzeInput(userInput)
    if (verdict["command"]) { executeCommand(verdict["command"]) }
    if (verdict["userInput"]) { broadcastToRoom(currentSocket, "home", userInput) }
  } else {
    if (isAvailableUsername(userInput)) {
      assignUsernameToSocket.call(currentSocket, userInput)
      welcomeUser(currentSocket)
    } else {
      nameTaken(currentSocket)
    }
  }
}

function assignUsernameToSocket(userInput ) {
  this.username = userInput
}

function isAvailableUsername(userInput) {
  return sockets.filter(function(socket) {
    return socket.username === userInput
  }).length < 1
}

function broadcastToRoom(currentSocket, room, userInput) {
  for (var i = 0; i < sockets.length; i++) {
    if (sockets[i].room === room && sockets[i] !== currentSocket) {
      sockets[i].write(currentSocket.username + ': ' + userInput + '\n')
    }
  }
}

function removeSocket() {
  var i = sockets.indexOf(this)
  sockets.splice(i, 1)
}

function executeCommand(command) {

}