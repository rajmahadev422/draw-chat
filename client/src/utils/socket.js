import io from "socket.io-client";

export const connectWS = () => {
  return io(import.meta.env.VITE_BACKEND.slice(0, -3), {
    path: "/chat-draw",
  });
};

export const enterFullscreen = () => {
  document.documentElement.requestFullscreen();
};

export const openFullscreen = async (screenRef) => {
  try {
    // fullscreen
    if (screenRef.current.requestFullscreen) {
      await screenRef.current.requestFullscreen();
    }

    // rotate landscape (mobile)
    if (screen.orientation?.lock) {
      await screen.orientation.lock("landscape");
    }
  } catch (err) {
    console.log(err);
  }
};

export const exitFullscreen = async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }

    // unlock rotation
    if (screen.orientation?.unlock) {
      screen.orientation.unlock();
    }
  } catch (err) {
    console.log(err);
  }
};

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();

  const sec = Math.floor(diff / 1000);

  if (sec < 60) {
    return "Just now";
  }

  const min = Math.floor(sec / 60);

  if (min < 60) {
    return `${min} min ago`;
  }

  const hr = Math.floor(min / 60);

  if (hr < 24) {
    return `${hr} hr ago`;
  }

  const day = Math.floor(hr / 24);

  return `${day} day ago`;
};