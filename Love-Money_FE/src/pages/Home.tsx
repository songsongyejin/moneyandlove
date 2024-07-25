import React from "react";
import "../index.css"; // 필요한 CSS 파일 import
import { useRecoilState } from "recoil";
import { userInfo } from "../atom/store"; // .ts 확장자는 생략 가능
import { Link } from "react-router-dom";
const Home: React.FC = () => {
  const [user, setUser] = useRecoilState(userInfo);

  const handleLogin = () => {
    setUser(true);
  };

  return (
    <div className="fixed relative h-screen">
      <div className="absolute inset-0 bg-main-bg bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <h1
            className="heartbeat text-8xl font-bold text-white text-shadow-custom text-stroke-custom"
            style={{ fontFamily: "DNFBitBitv2" }}
          >
            Money
            <br />& Love
          </h1>
          <button className="mt-10 w-72 rounded-md bg-btn-color py-3 font-bold text-white shadow-btn hover:scale-105">
            회원가입
          </button>
          <Link
            to="/main"
            onClick={handleLogin}
            className="mt-10 w-72 rounded-md bg-btn-color py-3 font-bold text-white shadow-btn hover:scale-105"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;