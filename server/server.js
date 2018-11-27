// console.log(__dirname + '/../public');
// Returns: D:\Documents\nodejs-udemy-andrew\node-chat-app\server/../public
// Converts paths so express middleware can be used and will keep the path 'clean' and cross-OS-compatible
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} =
 require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
// console.log(publicPath);
// Returns: D:\Documents\nodejs-udemy-andrew\node-chat-app\public

var app = express();
// 'app.listen()' is same as 'http.createServer()', which is http.createServer(app);
// Here we are configuring express to be able to work with 'http' in order to use socket.io
var server = http.createServer(app)
// 'SocketIO()' takes the server that you want to use for our web socket
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// the 'socket' argument is similar to 'socket' in index.html but it represents the individual socket as opposed to all the users connected to server
io.on('connection', (socket) => {
  console.log('New user connected');

  // SocketIO Rooms
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required!');
    }

    // .join() joins a room taking name of the room as string value as the argument
    // .leave() leaves a room taking name of the room as a string value as arg
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // Emit to everyone: io.emit -> io.to('The Office Fans').emit()
    // Emit to everyone but the current socket: socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit()
    // Client side emit (No need to direct to room): socket.emit

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // Emits to everyone but the'socket' that sent the message
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  // Custom Event Listener
  // Adding 'callback' as 2nd arg to arrow function will allow us to use 'callback()'. Thus, callback in index.js will fire 'acknowledging' the emitted event being received
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);

    // Custom Event Emitter
    // 'emit' takes 1st arg as name of event being emitted, and 2nd arg is options for that named event.
    // while 'socket.emit' emits an event to a single connection, 'io.emit' emits event to everyone connected
    io.emit('newMessage', generateMessage(message.from, message.text));
    // can add argument to 'callback()' (can be any data type) which can then be used in client's callback, 'data'.
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room}.`));
    }
    
    console.log('User has disconnected');
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
