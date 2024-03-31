// // server.js
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST', 'PUT', 'DELETE'],
//       allowedHeaders: ['Content-Type', 'Authorization']
//     }
//   });

// const PORT = process.env.PORT || 4000;

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('joinRoom', (room) => {
//     socket.join(room);
//   });

//   socket.on('sendMessage', (data) => {
//     io.to(data.room).emit('message', data.message);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
