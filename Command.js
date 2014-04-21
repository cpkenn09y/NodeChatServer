var Writer = require('./Writer')
var Room = require('./Room')
var RoomHelper = require('./RoomHelper')

var VALIDCOMMANDS = ["/create", "/rooms", "/join", "/users", "/help"]

function isValid(givenCommand) {
  return VALIDCOMMANDS.indexOf(givenCommand) >= 0
}

function execute(parsedInput, currentSocket, rooms, sockets) {
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
  case '/join':
    var specifiedRoom = parsedInput["specification"]
    rooms.forEach(function(room) {
      if (room.name === specifiedRoom) {
        currentSocket.room = specifiedRoom
      }
    })
    Writer.displayUsernames(currentSocket, sockets)
  }
}

module.exports = {
  isValid : isValid,
  execute : execute
}