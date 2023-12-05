const express = require('express');

const bodyParser = require('body-parser');

const App = express();
const dotenv = require('dotenv');

const cors = require('cors');

const Connection = require('./DbConnection/Db');
const routes = require('./Routes/routes.js');
// const path = require('path');

const server = require('http').createServer(App);

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', `https://sour-chat-app.netlify.app`],
  },
});

dotenv.config();

App.use(
  cors({
    origin: `*`,
  })
);

App.use(bodyParser.json());

App.use(bodyParser.urlencoded({ extended: true }));

App.use('/chatapp', routes);

const Port = process.env.PORT || 5000;

Connection()
  .then(() => {
    server.listen(Port, () => {
      console.log(`Server is Running sucessfully on ${Port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

io.on('connection', (socket) => {
  console.log('User Connected');

  socket.on('setup', (account) => {
    socket.join(account._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('joined room ', room);
  });

  socket.on('typing', (room) => {
    console.log('typing', room);
    socket.in(room).emit('typing');
  });
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    let chat = newMessageRecieved.chatId;

    if (!chat) {
      return console.log('users not defined in chat');
    }

    console.log(chat);

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        return;
      }

      socket.in(user._id).emit('message received', newMessageRecieved);
    });
  });

  socket.off('setup', () => {
    console.log('User Disconnected');

    socket.leave(account._id);
  });
});
