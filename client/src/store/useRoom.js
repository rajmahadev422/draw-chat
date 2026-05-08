import toast from "react-hot-toast";
import {create} from "zustand";
import { connectWS } from "../utils/socket";

const backendUrl = import.meta.env.VITE_BACKEND;

const useRoom = create((set, get) => ({
  loading: false,

  initialize: (io) => {
    set({io:io});
  },
  handleCreateRoom: async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomData = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch(`${backendUrl}/chat-draw/create-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create room");
      }
      const newRoom = await response.json();
      console.log(newRoom);
      window.location.href = `/room/${newRoom.data._id}`;
      return newRoom;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  handleJoinRoom: async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let { roomId } = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch(`${backendUrl}/chat-draw/find-room/${roomId}`, {credentials: "include"});

      const data = await res.json();

      if(!data.ok) {
        return toast.error(data.msg)
      }
      window.location.href = `/room/${roomId}`;
      e.target.reset();
    } catch (err) {
      toast.error("Error while joining the room")
    }
  },

  io: null,
  messages: [],

  handleMsg: (msg) => {
    set({messages: [...get().messages, msg]})
  }
}));

export default useRoom;