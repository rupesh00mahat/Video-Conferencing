const express = require('express');
const bodyParser = require('body-parser');
const {Server} = require('socket.io');

const io = new Server(
   {
      cors: true,
   }
);
const app = express();

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

app.use(bodyParser.json());
io.on('connection', (socket) =>{
     console.log('New connection');
     socket.on('join-room', (data)=>{
        const {roomId, emailId} = data;
        console.log('User', emailId, 'Joined Room', roomId);
        emailToSocketMapping.set(emailId, socket.id);
        socketToEmailMapping.set(socket.id, emailId);
        socket.join(roomId);
        socket.emit('joined-room', {roomId});
        socket.broadcast.to(roomId).emit('user-joined', {emailId});
     })

     socket.on('call-user', (data)=>{
      const {emailId, offer} = data;
      console.log('emailId, offer', emailId, offer);
      const fromEmail = socketToEmailMapping.get(socket.id);
      const socketId = emailToSocketMapping.get(emailId);
      io.to(socketId).emit('incoming-call', {from: fromEmail, offer})
     })
     socket.on('call-accepted', (data)=>{
      const {ans, emailId} = data;
      const fromEmail = socketToEmailMapping.get(socket.id);
      const socketId = emailToSocketMapping.get(emailId);
      io.to(socketId).emit('call-accepted', {from: fromEmail, ans});
     })
});

app.listen(8000, () => {console.log('Http server running on PORT 8000')});
io.listen(8001);