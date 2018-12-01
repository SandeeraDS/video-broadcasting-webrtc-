var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));


io.sockets.on('error', e => console.log(e));

io.on('connection', function (socket) {

   socket.on('broadcaster', function () {
      //id of the broadcaster
      broadcaster = socket.id;
      socket.broadcast.emit('broadcaster');
   });
   //Default room
   // Each Socket in Socket.IO is identified by a random, unguessable, unique identifier Socket#id. 
   //For your convenience, each socket automatically joins a room identified by this id.
   socket.on('watcher', function () {
      //tell to broadcast there is a watcher
      broadcaster && socket.to(broadcaster).emit('watcher', socket.id);
   });

   //send sdp to the client
   socket.on('offer', function (id /* of the watcher */, message) {
      socket.to(id).emit('offer', socket.id /* of the broadcaster */, message);
   });
   //send sdp of the client to broad caster
   socket.on('answer', function (id /* of the broadcaster */, message) {
      socket.to(id).emit('answer', socket.id /* of the watcher */, message);
   });

   //exchange ice candidate
   socket.on('candidate', function (id, message) {
      socket.to(id).emit('candidate', socket.id, message);
   });

   socket.on('disconnect', function () {
      broadcaster && socket.to(broadcaster).emit('bye', socket.id);
   });

});

http.listen(3000, function () {
   console.log('listening on *:3000');
});