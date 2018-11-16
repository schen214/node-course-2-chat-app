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

  // [ #1 ]
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  // .append() appends specified element at the very bottom
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  // can set attributes to elements using jQuery. If only one argument is specified (ex: a.attr('target') ), then it will retrieve the value of 'target'. If two args specified, then it will set that attribute.
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

// [ #2 ]
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

// Mozilla Geolocation API
var locationButton = jQuery('#send-location');
locationButton.on('click', function (e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  // 'getCurrentPosition()': 1st arg is success function, 2nd arg is error handler (When client doesnt allow their location to be tracked)
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position);

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.');
  });
});


// ^^ but WITHOUT jQuery:
// ----------
// [ #1 ]
// var node = document.createElement('LI');
// var textNode = document.createTextNode(`${message.from} : ${message.text}`);
//
// node.appendChild(textNode);
// document.getElementById('messages').appendChild(node);

// ----------
// [ #2 ]
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
