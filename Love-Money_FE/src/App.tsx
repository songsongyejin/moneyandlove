import Navbar from "./components/Header/Navbar.tsx";
import "./index.css";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { userInfo } from "./atom/store.ts";
import { useRecoilState } from "recoil";
import { mockLogin } from "./utils/mockLogin.ts";

function App() {
  const [user, setUser] = useRecoilState(userInfo);

  return (
    <>
      {user && <Navbar />}
      <Outlet />
    </>
  );
  // const [user, setUser] = useRecoilState(userInfo);
  // return (
  //   <>
  //     {user && <Navbar />}
  //     <Outlet></Outlet>
  //   </>
  // );
}

export default App;
