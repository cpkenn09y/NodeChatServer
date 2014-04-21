var net = require('net')
var parser = require('./parser')
var Writer = require('./Writer')
var Broadcaster = require('./Broadcaster')
var Room = require('./Room')
var SocketUsername = require('./SocketUsername')
var RoomHelper = require('./RoomHelper')

var server = net.Server()

server.listen(1337)

var sockets = []
var rooms = []

var DEFAULTROOM = "home"
var VALIDCOMMANDS = ["/create", "/rooms", "/join", "/users", "/help"]

rooms.push(new Room(DEFAULTROOM))

server.on('connection', function(socket) {
  socket.room = DEFAULTROOM
  sockets.push(socket)

  Writer.greet(socket)
  Writer.askName(socket)

  socket.on('data', respondToUserInput)
  socket.on('end', removeSocket)
})

function removeSocket() {
  var i = sockets.indexOf(this)
  sockets.splice(i, 1)
}

function respondToUserInput(data) {
  var currentSocket = this
  var userInput = data.toString().trim()
  if (currentSocket.username) {
    var parsedInput = parser.analyzeInput(userInput)
    if (parsedInput["userInput"]["command"]) { executeCommand(parsedInput["userInput"], currentSocket) }
    if (parsedInput["userInput"]["dialog"]) { Broadcaster.postDialog(currentSocket, userInput, sockets) }
  } else {
    if (SocketUsername.isAvailable(userInput, sockets) && SocketUsername.isValid(userInput)) {
      SocketUsername.assign.call(currentSocket, userInput)
      Writer.welcomeUser(currentSocket, currentSocket.username)
      Broadcaster.announceEnteredRoom(currentSocket, sockets)
    } else {
      Writer.notifyNameInvalid(currentSocket)
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