import { Router } from "express";
import User from "../models/User.model.js";
import Room from "../models/Room.model.js";

const chatDrawRouter = Router();

chatDrawRouter.get("/", (req, res) => {
  res.send("Chat Draw API");
});

chatDrawRouter.post("/create-room", async (req, res) => {
  let { roomTitle, players } = req.body;
  const userId = req.userId;

  const user = await User.findById(userId.id);

  if (!user) {
    return res.status(401).json({ ok: false, msg: "User not found" });
  }

  if(!roomTitle) roomTitle = "Ludo Game";

  let room = {
    roomTitle,
    host: {
      id: user._id,
      name: user.name,
    },
    maxNoOfPlayers: players,
    chats: [],
    players: [],
  };

  room = await Room.create(room);

  res
    .status(201)
    .json({ ok: true, msg: "Room created successfully", data: room });
});

chatDrawRouter.get('/find-room/:roomId', async (req, res) => {
  const {roomId} = req.params;
  
  try {
      const room = await Room.findById(roomId);

  if(!room) {
    return res.status(404).json({ok: false, msg: "Room not found"});
  }

  res.status(200).json({ok: true, msg: "received", data: roomId});
  } catch (err) {
    res.status(500).json({ok: false, msg: "Invalid Room Id"});
    console.log(err.message)
  }

})

export default chatDrawRouter;
