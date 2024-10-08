import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import GameHome from "./pages/GameHome.tsx";
import Room from "./pages/room/Room.tsx";
import LoginHandler from "./pages/login/LoginHandler.tsx";
import SignUpPage from "./pages/signUp/SignUpPage.tsx";
import AudioPlayer from "./components/audio/AudioPlayer.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { index: true, path: "/", element: <Home /> },
      { path: "main", element: <GameHome /> },
      { path: "room", element: <Room /> },
      {
        path: "login/oauth2/callback",
        element: <LoginHandler />,
      },
      { path: "signUp", element: <SignUpPage /> },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <AudioPlayer/>
      <RouterProvider router={router} />
    </RecoilRoot>
  </QueryClientProvider>
);
