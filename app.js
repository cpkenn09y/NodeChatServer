var net = require('net')
var parser = require('./parser')
var Room = require('./Room')
var Writer = require('./Writer')

var server = net.Server()

server.listen(1337)

var sockets = []
var rooms = []
rooms.push(new Room("home"))

server.on('connection', function(socket) {
  socket.room = "home"
  sockets.push(socket)

  sendGreeting(socket)
  askName(socket)

  socket.on('data', determineAction)
  socket.on('end', removeSocket)
})

function sendGreeting(socket) {
  Writer.greet(socket)
}

function askName(socket) {
  Writer.askName(socket)
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

function welcomeUser(socket) {
  Writer.welcomeUser(socket, socket.username)
}

function determineAction(data) {
  var currentSocket = this
  var userInput = data.toString().trim()
  if (currentSocket.username) {
    var parsedInput = parser.analyzeInput(userInput)
    if (parsedInput["userInput"]["command"]) { executeCommand(parsedInput["userInput"], currentSocket) }
    if (parsedInput["userInput"]["dialog"]) { broadcastToRoom(currentSocket, "home", userInput) }
  } else {
    if (isAvailableUsername(userInput) && userInput.length >= 2 && userInput.length <= 15) {
      assignUsernameToSocket.call(currentSocket, userInput)
      welcomeUser(currentSocket)
      var enteredAnnouncement = getEnteredNotification(currentSocket.username)
      serverBroadcastToRoom(currentSocket, currentSocket.room, enteredAnnouncement)
    } else {
      nameInvalid(currentSocket)
    }
  }
}

function getEnteredNotification(username) {
  return "* " + username + " has entered the room.\n"
}

function broadcastToRoom(currentSocket, room, userInput) {
  for (var i = 0; i < sockets.length; i++) {
    if (sockets[i].room === room && sockets[i] !== currentSocket) {
      sockets[i].write(currentSocket.username + ': ' + userInput + '\n')
    }
  }
}

function serverBroadcastToRoom(currentSocket, room, announcement) {
  for (var i = 0; i < sockets.length; i++) {
    if (sockets[i].room === room && sockets[i] !== currentSocket) {
      sockets[i].write(announcement)
    }
  }
}

function removeSocket() {
  var i = sockets.indexOf(this)
  sockets.splice(i, 1)
}

function executeCommand(parsedInput, currentSocket) {
  switch (parsedInput["command"]) {
  case '/rooms':
    displayRooms(rooms, currentSocket)
    break
  case '/create':
    var proposedRoomName = parsedInput["specification"]
    if (isAvailableRoomName(proposedRoomName)) {
      rooms.push(new Room(proposedRoomName))
      Writer.notifyRoomCreated(currentSocket, rooms[rooms.length-1].name)
    } else {
      Writer.notifyFailedRoomCreation(currentSocket, proposedRoomName)
    }
    break
  }
}

function isAvailableRoomName(proposedRoomName) {
  return rooms.filter(function(room) {
    return room.name === proposedRoomName
  }).length < 1
}

function displayRooms(rooms, currentSocket) {
  if (rooms.length) {
    Writer.notifyDisplayingRooms(currentSocket)
    rooms.forEach(function(room) {
      Writer.notifyRoomDetails(currentSocket, room.name, getRoomCount(room.name))
    })
  } else {
    Writer.notifyNoRooms(currentSocket)
  }
}

function getRoomCount(roomName) {
  return sockets.filter(function(socket) { return socket.room === roomName }).length
}