import Message from "../models/Message.model.js";
import Room from "../models/Room.model.js";

const activeRooms = {};
const rooms = {};

export default function chatDrawSocket(io, socket) {
  console.log("A user connected to chat-draw", socket.id);

  socket.on("join-room", async ({ roomId, user }) => {
    let room = await Room.findById(roomId);

    if (!room) {
      return socket.emit("error-message", "Room Not found");
    }

    if (!activeRooms[roomId]) {
      activeRooms[roomId] = {};
    }

    const existingUser = activeRooms[roomId][user._id];

    // remove old connection if same user joins again
    if (existingUser) {
      const oldSocket = io.sockets.sockets.get(existingUser.socketId);

      if (oldSocket) {
        oldSocket.disconnect();
      }
    }
    // store active user

    activeRooms[roomId][user._id] = {
      socketId: socket.id,
      name: user.name,
    };

    socket.join(roomId);
    socket.roomId = roomId;
    // Send existing strokes to newcomer only
    if (rooms[roomId]) {
      socket.emit("init-strokes", rooms[roomId]);
    } else {
      rooms[roomId] = [];
    }
    socket.userId = user._id;
    // notify room

    socket.to(roomId).emit("join-notice", user.name);

    io.to(roomId).emit("active-users", activeRooms[roomId]);
  });

    // A segment = one mouse-move tick (tiny payload)
  socket.on("draw-segment", (data) => {
    const { roomId, segment } = data;
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(segment);
    socket.to(roomId).emit("draw-segment", segment);
  });

  // Stroke ended — signals a pen-up
  socket.on("stroke-end", ({ roomId }) => {
    socket.to(roomId).emit("stroke-end");
  });

  socket.on("clear-board", ({ roomId }) => {
    if (rooms[roomId]) rooms[roomId] = [];
    socket.to(roomId).emit("clear-board");
  });
  
  socket.on("send-msg", ({ roomId, message, userId, name }) => {
    const newMsg = new Message({ message, userId, name });

    io.to(roomId).emit("receive-msg", newMsg);
  });

  socket.on("disconnect", () => {
    const { roomId, userId } = socket;

    if (roomId && userId && activeRooms[roomId]) {
      delete activeRooms[roomId][userId];

      // remove empty room
      // if (Object.keys(activeRooms[roomId]).length === 0) {
      //   delete activeRooms[roomId];
      // }

      io.to(roomId).emit("active-users", activeRooms[roomId] || {});
    }
  });
}
