const path = require("path");
const express = require('express');
const http = require('http');
const socketio = require("socket.io");
const formatMessage = require('./utils/messages.js');
const { userJoin, getCurrentUser }= require('./utils/users.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
const botName = 'LiveChat bot';

io.on('connection', socket => {

  socket.on('joinRoom',({username, room}) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room);
    
    socket.emit('message', formatMessage(botName, 'Welcome to Live Chat'));

    socket.broadcast.to(user.room).emit('message', formatMessage(botName,"A user has join the chat"));
  })

  

  

  socket.on('chatMessage', msg => {
    io.emit('message', formatMessage('USER', msg));
  })
  socket.on('disconnect', () => {
    io.emit("message", formatMessage(botName,"User has left the chat"));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT} `));