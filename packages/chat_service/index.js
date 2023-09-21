const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const messageRoutes = require('./routes/groupChat');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET", "POST"],
  }
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(keys.mongoURI, async (err) => {
  if (err) throw err;
  console.log('connected to db');
});

app.use("/messages", messageRoutes);

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log(`User ${data.user_id} joined chat room ${data.id}`)
    socket.join(data.id);
  })

  socket.on("send_message", (data) => {
    console.log(data)

    // Get the list of sockets in a room
    const socketsInRoom = io.sockets.adapter.rooms.get(data._id);

    // Emit the message if there are others in the room
    if(socketsInRoom.size > 1) {
      console.log(`Emmiting message to room ${data._id}.`)
      socket.to(data._id).emit("receive_message", data);
    }
  })

  socket.on('disconnect_room', (data) => {
    console.log(`User ${data.user_id} left chat room ${data.id}`)
    socket.leave(data.id)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});

server.listen(3232, () => {
  console.log('Listening on port 3232');
});
