// src/socket/server.js
import { Server } from "socket.io";

export const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://kazam-note-frontend-dbih.vercel.app", 
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Optional: You can handle other events here
  });

  return io; 
};
