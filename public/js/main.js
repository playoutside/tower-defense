$(document).ready(function() {

  /*
   * connect to socket.io
   */
  var socket = io.connect(window.location.href);
  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hello to you too, Mr.Server!' });
  });

  // Place JavaScript code here...

});