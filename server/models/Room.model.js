import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomTitle: {
      type: String,
      trim: true,
      default: "Ludo Game"
    },

    maxNoOfPlayers: {
      type: Number,
      required: true,
      min: 2,
      max: 10,
    },
    host: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
    },
    players: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    status: {
      type: String,
      default: "open"
    },
    chats: [
      {
        id: {
          type: String,
          required: true,
        },

        message: {
          type: String,
          required: true,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    turn: {
      type: Number,
      default: 0,
    },

    game: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
