import Navbar from "./components/Header/Navbar.tsx";
import "./index.css";
import { Outlet } from "react-router-dom";
import { userInfo } from "./atom/store.ts";
import { useRecoilState } from "recoil";

function App() {
  const [user, setUser] = useRecoilState(userInfo);
  return (
    <>
      {user && <Navbar />}
      <Outlet></Outlet>
    </>
  );
}

export default App;
