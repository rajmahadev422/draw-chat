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