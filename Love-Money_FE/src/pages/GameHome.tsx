import React, { useState } from "react";
import heartIcon from "../assets/heart_icon.svg";
import "../index.css"; // 필요한 CSS 파일 import
import FriendsSideBar from "../components/FriendsSideBar/FriendsSideBar";
import FaceVerification from "../components/game/FaceVerification";
import PositionSelection from "../components/game/PositionSelection";
import { useRecoilValue } from "recoil";
import { userInfo } from "../atom/store";

const GameHome: React.FC = () => {
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [showPositionSelection, setShowPositionSelection] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const user = useRecoilValue(userInfo);

  const handleGameStart = () => {
    // if (!user.isPhotoVerified) {
    //   setShowFaceVerification(true);
    // } else {
    //   setShowPositionSelection(true);
    // }
    // setShowFaceVerification(true);
    setShowPositionSelection(true);
  };

  const getBackgroundClass = () => {
    if (selectedPosition === "MAFIA") return "bg-mafia-bg";
    if (selectedPosition === "LOVE") return "bg-love-bg";
    return "bg-main-bg";
  };

  return (
    <div className="relative h-screen">
      <div
        className={`absolute inset-0 ${getBackgroundClass()} bg-cover bg-center`}
      ></div>
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative z-10 flex h-full items-center justify-center">
        <FriendsSideBar />

        <div className="flex flex-col items-center justify-center text-center">
          <h1
            className="text-6xl font-bold text-white text-shadow-custom"
            style={{
              fontFamily: "DNFBitBitv2",
              WebkitTextStroke: "0.01px #8B6CAC",
            }}
          >
            사랑하고 의심하라 !
          </h1>
          <p
            className="mt-6 text-xl font-semibold text-white text-shadow-custom text-stroke-custom"
            style={{
              fontFamily: "DNFBitBitv2",
              WebkitTextStroke: "0.01px #8B6CAC",
            }}
          >
            진정한 사랑을 찾는 새로운 러브 심리 게임
          </p>
          <div className="hvr-float-shadow relative mt-12 inline-block">
            <img
              src={heartIcon}
              alt="Heart Icon"
              className="absolute -left-16 top-2/3 h-24 w-24 -translate-y-1/2 transform"
            />
            <button
              onClick={handleGameStart}
              className="bg-custom-purple-color mt-10 h-16 w-40 rounded-md py-3 font-bold text-white shadow-btn text-stroke-custom"
              style={{
                borderRadius: "10px 50px 50px 10px",
                opacity: "var(--sds-size-stroke-border)",
              }}
            >
              <span
                className="text-xl"
                style={{
                  fontFamily: "DNFBitBitv2",
                }}
              >
                게임 시작
              </span>
            </button>
          </div>
        </div>
      </div>
      <FaceVerification
        isOpen={showFaceVerification}
        onClose={() => setShowFaceVerification(false)}
        onVerificationComplete={() => {
          setShowFaceVerification(false);
          setShowPositionSelection(true);
        }}
      />

      <PositionSelection
        isOpen={showPositionSelection}
        onClose={
          () => {
            setShowPositionSelection(false);
            setSelectedPosition(null);
          } // 모달을 닫을 때 선택된 포지션 초기화
        }
        onPositionSelect={(position) => {
          setSelectedPosition(position);
        }}
        onMatchStart={(position) => {
          console.log("매칭 시작", position);
          // 여기에 매칭 시작에 대한 추가 처리 로직
          // 예: 서버에 매칭 요청 전송, 게임 상태 업데이트 등
          setShowPositionSelection(false); // 매칭 시작 후 모달 닫기
          // 매칭 시작 후에도 selectedPosition은 유지되도록함
        }}
      />
    </div>
  );
};

export default GameHome;
