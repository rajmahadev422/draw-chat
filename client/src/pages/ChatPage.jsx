import { useState } from "react";
import { useParams } from "react-router-dom";
import useRoom from "../store/useRoom";
import useAuth from "../store/useAuth";
import { useEffect } from "react";

export default function Chat() {
  const { roomId } = useParams();

  const { messages, io, handleMsg } = useRoom();
  const { user } = useAuth();
  const currentUserId = "u1";

  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
console.log(message);
    io.emit("send-msg", { roomId, message, userId: user._id });

    setMessage("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.map((msg, index) => {
          const isMe = msg.userId === user._id;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-[75%] wrap-break shadow-md ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-white text-black rounded-bl-md"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-slate-900 p-4 sticky bottom-0">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type message..."
            className="flex-1 bg-slate-800 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={sendMessage}
            disabled={!io}
            className="bg-blue-500 hover:bg-blue-600 transition-all px-6 py-3 rounded-xl font-medium text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
