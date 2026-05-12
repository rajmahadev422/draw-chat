import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import App from "./App";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import ProtectedRoute from "./components/ProtectedRoute";
import WaitingRoom from "./pages/WaitingRoom";
import ChatPage from "./pages/ChatPage";
import GamePage from "./pages/GamePage";
import ActiveRooms from "./pages/ActiveRooms";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/room",
            element: <RoomPage />,
          },
          {
            path: "/room/all",
            element: <ActiveRooms />
          },
          {
            path: "/room/:roomId",
            element: <WaitingRoom />,
            children: [
              {
                index: true,
                element: <ChatPage />
              },
              {
                path: "game",
                element: <GamePage />
              }
            ]
          }
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

export default Router;
