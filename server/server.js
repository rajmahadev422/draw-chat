import express from "express";
// import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
//local imports
import chatDrawSocket from "./socket/chatDraw.socket.js";
import chatDrawRouter from "./routes/chatDraw.route.js";
import authRouter from "./routes/auth.route.js";
import { protect } from "./utils/connect.js";
import { disconnect } from "cluster";

const app = express();
const server = createServer(app);
configDotenv();

const chatDrawIo = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
  path: "/chat-draw",
});

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }
// ));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/api/auth", authRouter);
app.use("/api/chat-draw", protect, chatDrawRouter);

chatDrawIo.on("connection", (socket) => chatDrawSocket(chatDrawIo, socket));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));


app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    // Start server ONLY after DB connects
    server.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });
