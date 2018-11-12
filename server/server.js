// console.log(__dirname + '/../public');
// Returns: D:\Documents\nodejs-udemy-andrew\node-chat-app\server/../public
// Converts paths so express middleware can be used and will keep the path 'clean' and cross-OS-compatible
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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

app.use(express.static(publicPath));

// the 'socket' argument is similar to 'socket' in index.html but it represents the individual socket as opposed to all the users connected to server
io.on('connection', (socket) => {
  console.log('New user connected');

  // Custom Event Listener
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    // Custom Event Emitter
    // 'emit' takes 1st arg as name of event being emitted, and 2nd arg is options for that named event.
    // while 'socket.emit' emits an event to a single connection, 'io.emit' emits event to every single connection
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('User has disconnected');
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
