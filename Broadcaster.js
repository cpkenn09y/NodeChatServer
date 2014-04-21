function postDialog(speakerSocket, speakerInput, sockets) {
  for (var i = 0; i < sockets.length; i++) {
    if (sockets[i].room === speakerSocket.room && sockets[i] !== speakerSocket) {
      sockets[i].write(speakerSocket.username + ': ' + speakerInput + '\n')
    }
  }
}

function announceEnteredRoom(speakerSocket, sockets) {
  for (var i = 0; i < sockets.length; i++) {
    if (sockets[i].room === speakerSocket.room && sockets[i] !== speakerSocket) {
      sockets[i].write("* " + speakerSocket.username + " has entered the room.\n")
    }
  }
}

module.exports = {
  postDialog : postDialog,
  announceEnteredRoom : announceEnteredRoom
}