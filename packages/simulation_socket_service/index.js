const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3333;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:9000"],
    methods: ["GET", "POST"],
  }
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const roomElements = [];

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_simulation", (data) => {
    console.log(`User ${data.user_id} joined room ${data.id}`)
    socket.join(data.id);
    // Get the number of clients in the room
    var count = io._nsps.get('/').adapter.rooms.get(data.id).size;

    // Emit the count to the client
    io.to(data.id).emit("room_count", count);
    /* if (roomElements[data.id] && Object.keys(roomElements[data.id]).length > 0) {
      io.to(data.id).emit("receive_sprint_num", Object.keys(roomElements[data.id]).filter(key => key !== "Tasks").length)
      io.to(data.id).emit("receive_dragdrop_update", roomElements[data.id]);
    } */

    socket.to(data.id).emit('joined_teamate');

    console.log(`There is currently ${count} people in room ${data.id}`)
  })

  socket.on('sprint_num', (data) => {
    console.log(data)
    socket.to(data.id).emit("receive_sprint_num", data.sprintNum);
  })

  socket.on('dragdrop_update', (data) => {
    console.log(data)
    socket.to(data.id).emit("receive_dragdrop_update", data.elements);
  })

  socket.on('send_open_backlog', (data) => {
    socket.to(data.id).emit("receive_open_backlog", data.elements)
  })

  socket.on('send_task_ids', (data) => {
    console.log(data)
    socket.to(data.id).emit("receive_task_ids", {taskIds: data.taskIds, workerId: data.workerId});
  })

  socket.on('send_backlogs', (data) => {
    console.log("Sending backlogs to others:")
    console.log(data)
    socket.to(data.id).emit("receive_backlogs", data.currentBacklogs);
  })

  socket.on('send_message', (data) => {
    console.log(data)
    socket.to(data.id).emit("receive_message", {senderId: data.senderId, content: data.content, username: data.username, timestamp: data.timestamp});
  })

  socket.on("send_capacity_change", (data) => {
    console.log("Sending capacity change to others:")
    console.log(data)
    socket.to(data.id).emit("receive_capacity_change", {workerId: data.workerId, value: data.value});
  });

  socket.on("send_review_sprint", (data) => {
    console.log(data)
    socket.to(data.id).emit("receive_review_sprint", {currentBacklogs: data.currentBacklogs, talentsMap: data.talentsMap, workerCapacityMap: data.workerCapacityMap, notCompletedTasks: data.notCompletedTasks });
  });

  socket.on("send_review_project", (data) => {
    console.log(data)
    socket.to(data.id).emit("receive_review_project", data.project);
  });

  socket.on("send_click_next", (room) => {
    socket.to(room).emit("receive_click_next");
  });

  socket.on('send_updated_backlog_props', (data) => {
    console.log(data)
    console.log(data.backlogProps.backlogs)
    socket.to(data.id).emit("receive_updated_backlog_props", { workerId: data.workerId, backlogProps: data.backlogProps, taskIds: data.taskIds});
  })

  socket.on('disconnect_room', (room) => {
    socket.leave(room)
    try {
      var count = io._nsps.get('/').adapter.rooms.get(room).size;
      socket.to(room).emit('room_count', count);
      console.log(`A user disconnected from room ${room}`);
    } catch (error) {
      console.log("The room does not exist(everyone left).")
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
