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
import GameHome from "./pages/GameHome.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { index: true, path: "/", element: <Home /> },
      { path: "main", element: <GameHome /> },
      // // { path: "products/new", element: <NewProduct /> },
      // // { path: "products/:id", element: <ProductDetail /> },
      // // { path: "cart", element: <MyCart /> },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
