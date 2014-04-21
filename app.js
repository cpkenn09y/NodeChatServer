var net = require('net')
var parser = require('./parser')
var Room = require('./Room')

var server = net.Server()

server.listen(1337)

var sockets = []
var rooms = []

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
  socket.write("What would you like your username to be?? (2-15 characters)\n")
}

function isAvailableUsername(userInput) {
  return sockets.filter(function(socket) {
    return socket.username === userInput
  }).length < 1
}

function nameInvalid(socket) {
  socket.write("Sorry, please try again.\nThe name you have provided is either taken or has failed validation.\n")
  askName(socket)
}

function assignUsernameToSocket(userInput ) {
  this.username = userInput
}

function welcomeUser(socket) {
  socket.write("Welcome " + socket.username + "! You are among friends.\n")
  socket.write("Start talking to the community! For a list of commands write /help\n")
}

function determineAction(data) {
  var currentSocket = this
  var userInput = data.toString().trim()
  if (currentSocket.username) {
    var parsedInput = parser.analyzeInput(userInput)
    if (parsedInput["userInput"]["command"]) { executeCommand(parsedInput["userInput"], currentSocket) }
    if (parsedInput["userInput"]) { broadcastToRoom(currentSocket, "home", userInput) }
  } else {
    if (isAvailableUsername(userInput) && userInput.length >= 2 && userInput.length <= 15) {
      assignUsernameToSocket.call(currentSocket, userInput)
      welcomeUser(currentSocket)
    } else {
      nameInvalid(currentSocket)
    }
  }
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

function executeCommand(parsedInput, currentSocket) {
  switch (parsedInput["command"]) {
  case '/rooms':
    displayRooms(rooms, currentSocket)
    break
  case '/create':
    var proposedRoomName = parsedInput["specification"]
    if (isAvailableRoomName(proposedRoomName)) {
      rooms.push(new Room(proposedRoomName))
      currentSocket.write("ROOM CREATION SUCCESSFUL YOU CAN JOIN THE ROOM BY ENTERING: /join " + rooms[rooms.length-1].name + "\n")
    } else {
      currentSocket.write("THERE IS ALREADY A ROOM WITH THE NAME: " + proposedRoomName + "\n")
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
  if (rooms.length) { currentSocket.write("Now Displaying Rooms:\n")
    rooms.forEach(function(room) {
      currentSocket.write(room.name + " contains [" + getRoomCount(room.name) + "]\n")
    })
  } else {
    currentSocket.write("There are currently no rooms made.\nTo create a room, use the command /create followed by the room name\nex: /create myRoom\n")
  }
}

function getRoomCount(roomName) {
  return sockets.filter(function(socket) { return socket.room === roomName }).length
}