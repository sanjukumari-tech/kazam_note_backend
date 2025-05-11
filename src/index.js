import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";

import taskRoutes from "./routes/taskRoutes.js";
import connectDB from "./config/db.js";
import { initSocketServer } from "./socket/server.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const io = initSocketServer(server);
app.locals.io = io;
const allowedOrigins = [
  'http://localhost:5173',
  'https://kazam-note-frontend-dbih.vercel.app'
];
app.use(
  cors({
    origin:function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", taskRoutes);

server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to connect to DB:", err);

  }
});
