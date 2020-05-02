const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when clients connects
io.on('connection', socket => {

  // Welcome current user
  socket.emit('message', 'Welcome to Chat.');

  // Broadcast when user connects
  socket.broadcast.emit('message', 'A user has joined the chat.');

  // Run when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    socket.emit('message', msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));