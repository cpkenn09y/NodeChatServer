var MINUSERNAMELENGTH = 2
var MAXUSERNAMELENGTH = 15

function isAvailable(userInput, sockets) {
  return sockets.filter(function(socket) {
    return socket.username === userInput
  }).length < 1
}

function isValid(proposedName) {
  return proposedName.length >= MINUSERNAMELENGTH && proposedName.length <= MAXUSERNAMELENGTH
}

function assign(userInput) {
  this.username = userInput
}

module.exports = {
  isAvailable : isAvailable,
  isValid : isValid,
  assign : assign
}