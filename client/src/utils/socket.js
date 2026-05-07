import io from 'socket.io-client';

export const connectWS = () => {
  return io(import.meta.env.VITE_BACKEND, {
    path: '/chat-draw',
  });
}