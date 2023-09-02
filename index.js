const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server,{
  cors: {origin: "*"
}
});
const users={};
// Enable CORS for the specific orig
app.use(cors());

app.get('/', (req,res)=>{
  res.send("Hii working chat server")
})
// Socket.IO connection handling
io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    console.log('user', name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });
});

const PORT = process.env.PORT || 1000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
