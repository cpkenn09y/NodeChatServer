function greet(socket) {
  socket.write("Hello and welcome to PandaChat!\n")
}

function askName(socket) {
  socket.write("What would you like your username to be?? (2-15 characters)\n")
}

function notifyNameInvalid(socket) {
  socket.write("Sorry, please try again.\n")
  socket.write("The name you have provided is either taken or has failed validation.\n")
  socket.write("Type the command /users to see a list of all taken usernames\n")
  askName(socket)
}

function welcomeUser(socket, username) {
  socket.write("Welcome " + username + "! You are amongst friends.\n")
  socket.write("Start talking to the community! For a list of commands write /help\n")
}

function notifyRoomCreated(socket, roomName) {
  socket.write("ROOM CREATION SUCCESSFUL YOU CAN JOIN THE ROOM BY ENTERING: /join " + roomName + "\n")
}

function notifyFailedRoomCreation(socket, roomName) {
  socket.write("THERE IS ALREADY A ROOM WITH THE NAME: " + roomName + "\n")
}

function notifyNoRooms(socket) {
  socket.write("There are currently no rooms made.\n")
  socket.write("To create a room, use the command /create followed by the room name\n")
  socket.write("ex: /create myRoom\n")
}

function notifyDisplayingRooms(socket) {
  socket.write("Now Displaying Rooms:\n")
}

function notifyRoomDetails(socket, roomName, roomUserCount) {
  socket.write(roomName + " contains [" + roomUserCount + "]\n")
}

function displayUsernames(socket, sockets) {
  socket.write("User(s) within this room:\n")
  sockets.forEach(function(s) { socket.write("* " + s.username + "\n") })
}

module.exports = {
  greet : greet,
  askName : askName,
  notifyNameInvalid : notifyNameInvalid,
  welcomeUser : welcomeUser,
  notifyRoomCreated : notifyRoomCreated,
  notifyFailedRoomCreation : notifyFailedRoomCreation,
  notifyNoRooms : notifyNoRooms,
  notifyDisplayingRooms : notifyDisplayingRooms,
  notifyRoomDetails : notifyRoomDetails,
  displayUsernames : displayUsernames
}