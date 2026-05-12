import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useRoom from "../store/useRoom";
import useAuth from "../store/useAuth";
import { timeAgo } from "../utils/socket";
import toast from "react-hot-toast";

export default function Chat() {
  const { roomId } = useParams();
  const { messages, io } = useRoom();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !io) return;
    io.emit("send-msg", { roomId, message, userId: user._id, name: user.name });
    setMessage("");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied!");
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0f1e] overflow-hidden">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg, index) => {
          const isMe = msg.userId === user._id;
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col gap-1 max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
                <span className={`text-[11px] font-medium px-1 ${isMe ? "text-purple-400/70" : "text-white/40"}`}>
                  {isMe ? "You" : msg.name}
                </span>
                <div className={`px-3.5 py-2.5 text-sm leading-relaxed text-white/90 wrap-break-words ${
                  isMe
                    ? "bg-purple-700 rounded-2xl rounded-br-sm"
                    : "bg-white/[0.07] border border-white/8 rounded-2xl rounded-bl-sm"
                }`}>
                  {msg.message}
                </div>
                {msg.createdAt && (
                  <span className="text-[10px] text-white/25 px-1">
                    {timeAgo(msg.createdAt)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 flex items-center gap-2.5 px-3 py-3 bg-[#0d1321] border-t border-white/6">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message or your guess…"
          className="flex-1 bg-white/5 border border-white/9 rounded-xl px-3.5 py-2.5
                     text-sm text-white placeholder-white/20 outline-none
                     focus:border-purple-500/50 focus:bg-white/8 transition-colors"
        />
        <button
          onClick={sendMessage}
          disabled={!io}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-purple-700 hover:bg-purple-600
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          title="Send"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
          </svg>
        </button>
      </div>
    </div>
  );
}