# My Chat Server using Node.js

I created a chat server for a coding challenge

## Design Aspects:

* Aim to create a simple interface for users
* Leverage OOP principles such as single responsibility and dependency inversion
* Write modular code that can be reused
* Provide the user with quick feedback loop
* Refactor frequently to write high quality code
* Keep performance speed and scalability in mind while writing code
* Create variable and function names that convey their purpose

## Future Improvements

* Improve the user experience
* Keep refactoring code for increased efficiency and readability
* Make the code and file structure follow best practices
* Add more functionality such as private messaging
* Leverage different js design patterns
* Add emojis for funsies

## To Run the Application Locally:

[Install Node if you do not already have it:](http://howtonode.org/how-to-install-nodejs)

1. Open the Terminal Application (Mac OSX)
2. Copy and Paste Each Line of Code:

* cd Desktop
* git clone https://github.com/cpkenn09y/NodeChatServer.git
* cd NodeChatServer
* node app.js

3. Open a new tab by pressing -> Command T
4. In the new tab enter the following code

* telnet 127.0.0.1 1337

5. Play with the app!

## Once connected to the app via the above directions:

* You must first enter a username
* From there you can simply type messages that will get broadcast to other users within the room
* You can create rooms, place the name you would like to call the room after the command /create
  * /create ______
* You can see who is within the room you are currently in
  * /users
* You can see what rooms are available to join
  * /rooms
* You can join any of the available rooms
  * /join
* You can see a list of the possible commands
  * /help

### Currently Available Commands:

* /create
* /rooms
* /join
* /users
* /help

#### Images:
Working layout as of April 21, 2014:
![image](http://i.imgur.com/17k0SMQ.png)
