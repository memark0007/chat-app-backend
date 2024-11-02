import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🔵 ผู้ใช้เชื่อมต่อ:', socket.id);

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('typing', (username: string) => {
    socket.broadcast.emit('display_typing', username);
  });

  socket.on('stop_typing', () => {
    socket.broadcast.emit('hide_typing');
  });

  socket.on('disconnect', () => {
    console.log('🔴 ผู้ใช้ตัดการเชื่อมต่อ:', socket.id);
  });
});


server.listen(4000, () => {
  console.log('✅ เซิร์ฟเวอร์กำลังรันบนพอร์ต 4000');
});
