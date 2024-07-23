import React from "react";
import heartIcon from "../assets/heart_icon.png";
import friendlistIcon from "../assets/friend_list_icon.png";
import "../index.css"; // 필요한 CSS 파일 import
import FreindsSideBar from "../components/FrindesSideBar/FriendsSideBar";

const GameHome: React.FC = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-main-bg bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative z-10 flex h-full items-center justify-center">
        <FreindsSideBar />

        <div className="flex flex-col items-center justify-center text-center">
          <h1
            className="text-6xl font-bold text-white text-shadow-custom"
            style={{
              fontFamily: "DNFBitBitv2",
              WebkitTextStroke: "0.01px #113F63",
            }}
          >
            사랑하고 의심하라 !
          </h1>
          <p
            className="mt-6 text-xl font-semibold text-white text-shadow-custom text-stroke-custom"
            style={{
              fontFamily: "DNFBitBitv2",
              WebkitTextStroke: "0.01px #113F63",
            }}
          >
            진정한 사랑을 찾는 새로운 러브 심리 게임
          </p>
          <div className="relative mt-12 inline-block hover:scale-105">
            <img
              src={heartIcon}
              alt="Heart Icon"
              className="absolute -left-16 top-2/3 h-24 w-24 -translate-y-1/2 transform"
            />
            <button
              className="mt-10 h-16 w-40 rounded-md py-3 font-bold text-white shadow-btn text-stroke-custom"
              style={{
                borderRadius: "10px 50px 50px 10px",
                backgroundColor: "#113F63",
                opacity: "var(--sds-size-stroke-border)",
              }}
            >
              <span
                className="text-xl"
                style={{
                  fontFamily: "DNFBitBitv2",
                  WebkitTextStroke: "0.05px #113F63",
                }}
              >
                게임 시작
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* 친구추가 버튼 우하단 고정 */}
    </div>
  );
};

export default GameHome;
