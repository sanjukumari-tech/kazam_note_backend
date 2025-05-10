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
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", taskRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on port no http://localhost:${PORT}`);
});

// import express from "express";
// import cors from "cors";
// import {createServer} from "http";
// import {Server} from "socket.io";
// import taskRoutes from "./routes/taskRoutes.js";
// const app = express();
// const httpServer = createServer(app);

// const io = new Server(httpServer,{
//    cors:{origin:"http://localhost:5173",
//       methods:["GET","POST"]
//    }
// });

// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST'],
//   credentials: true
// }))

// const port = process.env.PORT ||5000;
// app.use(express.json());

// app.locals.io = io;
// app.use("/api",taskRoutes);

// io.on("connection",(socket)=>{
//    console.log("client connected: ",socket.id);
//    socket.on("disconnected",()=>{
//       console.log("client disconnected",socket.id)
//    })
// })

// httpServer.listen(port,()=>{
//    console.log(`Server running on http://localhost:${port}`)
// })
