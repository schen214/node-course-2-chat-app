//'io()' initializes the request from the client to the server to open up a web socket and keeps it open
var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// Custom Event Listener
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});
