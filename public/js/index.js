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

  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
  // ^^ but WITHOUT jQuery:
  // var node = document.createElement('LI');
  // var textNode = document.createTextNode(`${message.from} : ${message.text}`);
  //
  // node.appendChild(textNode);
  // document.getElementById('messages').appendChild(node);
});

// in '.on()' callback, the arg 'e' stands for event
jQuery('#message-form').on('submit', function (e) {
  // 'preventDefault()' prevents default behavior of an event (in this case on the 'submit' event)
  e.preventDefault();

  // 'emit()' Can take a 3rd argument, callback function, which will fire when the 'event acknowledgement' arrives from server to the client
  socket.emit('createMessage', {
      from: 'User',
      text: jQuery('[name=message]').val()
  }, function () {

  });
});
// ^^ but WITHOUT jQuery:
// document.getElementById('message-form').addEventListener('submit', function (e) {
//
// e.preventDefault();
//
// var inputValue = document.getElementsByName('message')
// socket.emit('createMessage', {
//   from: 'User',
//   text: inputValue[0].value
// }, function () {
//
// });
//
// inputValue[0].value = '';
// });
