var Writer = require('./Writer')

function isAvailableName(rooms, proposedRoomName) {
  return rooms.filter(function(room) {
    return room.name === proposedRoomName
  }).length < 1
}

function displayRooms(rooms, currentSocket, sockets) {
  if (rooms.length) {
    Writer.notifyDisplayingRooms(currentSocket)
    rooms.forEach(function(room) {
      Writer.notifyRoomDetails(currentSocket, room.name, getUserCount(room.name, sockets))
    })
  } else {
    Writer.notifyNoRooms(currentSocket)
  }
}

function getUserCount(roomName, sockets) {
  return sockets.filter(function(socket) { return socket.room === roomName }).length
}

module.exports = {
  isAvailableName : isAvailableName,
  displayRooms : displayRooms,
  getUserCount : getUserCount
}