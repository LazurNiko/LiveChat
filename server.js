const path = require("path");
const express = require('express');
const http = require('http');
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  socket.emit('message', 'Welcome to Live Chat');

  socket.broadcast.emit('message', "A user has join the chat");

  socket.on('disconnect', () => {
    io.emit("message", "User has left the chat");
  });

  socket.on('chatMessage', msg => {
    io.emit('message', msg);
  })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT} `));