// console.log(__dirname + '/../public');
// Returns: D:\Documents\nodejs-udemy-andrew\node-chat-app\server/../public
// Converts paths so express middleware can be used and will keep the path 'clean' and cross-OS-compatible
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public', );
// console.log(publicPath);
// Returns: D:\Documents\nodejs-udemy-andrew\node-chat-app\public
var app = express();
// 'app.listen()' is same as 'http.createServer()', which is http.createServer(app);
// Here we are configuring express to be able to work with 'http' in order to use socket.io
var server = http.createServer(app)
// 'SocketIO()' takes the server that you want to use for our web socket
var io = socketIO(server);

app.use(express.static(publicPath));

// the 'socket' argument is similar to 'socket' in index.html but it represents the individual socoket as opposed to all the users connected to server
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User has disconnected');
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
