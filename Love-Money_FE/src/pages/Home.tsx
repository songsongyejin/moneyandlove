import React from "react";
import "../index.css"; // 필요한 CSS 파일 import
import { useRecoilState } from "recoil";
import { userInfo } from "../atom/store"; // .ts 확장자는 생략 가능
import { Link, useNavigate } from "react-router-dom";
import { mockLogin } from "../utils/mockLogin";
import kakaoLoginImage from "../assets/kakao_login_large_wide.png";
import useFullscreen from "../utils/useFullScreen";
import { KAKAO_AUTH_URL } from "../utils/OAuth";

const Home: React.FC = () => {
  //유저 로그인 정보
  const [user, setUser] = useRecoilState(userInfo);
  const navigate = useNavigate();

  const handleLogin = () => {
    // setUser(true);
    const loggedInUser = mockLogin();
    setUser(loggedInUser);
    navigate("/main");
    triggerFull();
  };

  const onFullS = (isFull: any) => {
    console.log(isFull ? "We are full" : "We are small");
  };
  const { element, triggerFull, exitFull } = useFullscreen(onFullS);

  return (
    <div className="fixed relative h-screen" ref={element}>
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
          {/* <button className="mt-10 w-72 rounded-md bg-btn-color py-3 font-bold text-white shadow-btn hover:scale-105">
            회원가입
          </button> */}
          {/* <Link
            to="/main"
            onClick={handleLogin}
            className="mt-10 w-72 rounded-md bg-btn-color py-3 font-bold text-white shadow-btn hover:scale-105"
          >
            로그인
          </Link> */}
          {/* <button
            onClick={handleLogin}
            className="mt-10 w-72 rounded-md bg-btn-color py-3 font-bold text-white shadow-btn hover:scale-105"
          >
            로그인
          </button> */}
          <a
            // onClick={handleLogin}
            href={KAKAO_AUTH_URL}
            className="mt-20 w-80 shadow-btn transition-transform hover:scale-105"
          >
            <img
              src={kakaoLoginImage}
              alt="카카오 로그인"
              className="h-auto w-full"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
