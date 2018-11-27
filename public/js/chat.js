//'io()' initializes the request from the client to the server to open up a web socket and keeps it open
var socket = io();

//'scrollToBottom()' will scroll user to bottom of page using 'scrollHeight', 'clientHeight', 'scrollTop' properties
function scrollToBottom() {
  // Selectors
  // newMessage wiil grab the last message written
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  // .'prop()' returns values of specified properties
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  // '.prev()' will grab the 2nd to last child of 'li:last-child'
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    console.log(scrollHeight);
    console.log(scrollTop);
    // 'scrollTop()' jQuery that allows you to specify the value(number) for scrolling
    messages.scrollTop(scrollHeight);
  } else if (scrollHeight > 700) {
    $('#scrollToBottom').css('display', 'inline');

    $('#scrollToBottom').click(function () {
      messages.scrollTop(scrollHeight);
      $('#scrollToBottom').css('display', 'none');
    });
  }
}

socket.on('connect', function () {
  // console.log('Connected to server');
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      // routes user back to root page
      window.location.href = '/'
    } else {
      console.log("No error");
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  // console.log(`Users List: ${users}`);
  var ol = $('<ol></ol>');

  users.forEach(function (user) {
    ol.append($('<li></li>').text(user));
  });

  // Using '.html()' instead of '.appened()' since html will wipe and replace the Peoples list as opposed to adding on to it
  $('#users').html(ol);
});

// Custom Event Listener
socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // Mustache.js:
  // '.html()' returns the markup inside #message-template, which is the template code (<p>This is a template</p>)
  var template = jQuery('#message-template').html();
  // What we will eventually add into the browser.
  // 'render()' takes as an arg the template we want to show and 2nd arg an object key-value pairs for what you want to render in in ur html (Dynamic rendering of template)... then you would place ex: '{{text}}' in ur html
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();

  // console.log('newMessage', message);
  //
  // // [ #1 ]
  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  //
  // // .append() appends specified element at the very bottom
  // jQuery('#messages').append(li);
});

// Using Mustache.js
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  jQuery('#messages').append(html);
  scrollToBottom();

  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>');
  //
  // li.text(`${message.from} ${formattedTime}: `);
  // // can set attributes to elements using jQuery. If only one argument is specified (ex: a.attr('target') ), then it will retrieve the value of 'target'. If two args specified, then it will set that attribute.
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
});

// [ #2 ]
// in '.on()' callback, the arg 'e' stands for event
jQuery('#message-form').on('submit', function (e) {
  // 'preventDefault()' prevents default behavior of an event (in this case on the 'submit' event)
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  // 'emit()' Can take a 3rd argument, callback function, which will fire when the 'event acknowledgement' arrives from server to the client
  socket.emit('createMessage', {
      from: 'User',
      text: messageTextbox.val()
  }, function () {
    // Using 'event acknowledgement' to clear the message in input element
    messageTextbox.val('');
  });
});

// Mozilla Geolocation API
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  // Added attribute to locationButton where disabled="disabled", so users can't spam button while location is being retrieved
  // Args MUST be in String!
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  // 'getCurrentPosition()': 1st arg is success function, 2nd arg is error handler (When client doesnt allow their location to be tracked)
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position);
    // 'removeAttr()' removes attribute specified in arg
    locationButton.removeAttr('disabled').text('Send location');

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});


// ^^ Pure Javascript:
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
