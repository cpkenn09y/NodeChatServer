var net = require('net')
var parser = require('./parser')
var Writer = require('./Writer')
var Broadcaster = require('./Broadcaster')
var Room = require('./Room')
var RoomHelper = require('./RoomHelper')

var server = net.Server()

server.listen(1337)

var sockets = []
var rooms = []
var DEFAULTROOM = "home"
rooms.push(new Room(DEFAULTROOM))

server.on('connection', function(socket) {
  socket.room = DEFAULTROOM
  sockets.push(socket)

  Writer.greet(socket)
  Writer.askName(socket)

  socket.on('data', determineAction)
  socket.on('end', removeSocket)
})

function removeSocket() {
  var i = sockets.indexOf(this)
  sockets.splice(i, 1)
}

function isAvailableUsername(userInput) {
  return sockets.filter(function(socket) {
    return socket.username === userInput
  }).length < 1
}

function nameInvalid(socket) {
  Writer.notifyNameInvalid(socket)
  Writer.askName(socket)
}

function assignUsernameToSocket(userInput ) {
  this.username = userInput
}

function determineAction(data) {
  var currentSocket = this
  var userInput = data.toString().trim()
  if (currentSocket.username) {
    var parsedInput = parser.analyzeInput(userInput)
    if (parsedInput["userInput"]["command"]) { executeCommand(parsedInput["userInput"], currentSocket) }
    if (parsedInput["userInput"]["dialog"]) { Broadcaster.postDialog(currentSocket, userInput, sockets) }
  } else {
    if (isAvailableUsername(userInput) && userInput.length >= 2 && userInput.length <= 15) {
      assignUsernameToSocket.call(currentSocket, userInput)
      Writer.welcomeUser(currentSocket, currentSocket.username)
      Broadcaster.announceEnteredRoom(currentSocket, sockets)
    } else {
      nameInvalid(currentSocket)
    }
  }
}

function executeCommand(parsedInput, currentSocket) {
  switch (parsedInput["command"]) {
  case '/rooms':
    RoomHelper.displayRooms(rooms, currentSocket, sockets)
    break
  case '/create':
    var proposedRoomName = parsedInput["specification"]
    if (RoomHelper.isAvailableName(rooms, proposedRoomName)) {
      rooms.push(new Room(proposedRoomName))
      Writer.notifyRoomCreated(currentSocket, rooms[rooms.length-1].name)
    } else {
      Writer.notifyFailedRoomCreation(currentSocket, proposedRoomName)
    }
    break
  }
}