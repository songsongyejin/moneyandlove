import React, { useState } from "react";
import heartIcon from "../assets/start_heart_icon.svg";
import "../index.css"; // 필요한 CSS 파일 import
import FriendsSideBar from "../components/FriendsSideBar/FriendsSideBar";
import FaceVerification from "../components/game/FaceVerification";
import PositionSelection from "../components/game/PositionSelection";
import Matching from "../components/game/Matching";
import { useRecoilValue } from "recoil";
import { userInfo } from "../atom/store";

const GameHome: React.FC = () => {
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [showPositionSelection, setShowPositionSelection] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [showMatching, setShowMatching] = useState(false);
  const user = useRecoilValue(userInfo);

  const handleGameStart = () => {
    // if (!user.isPhotoVerified) {
    //   setShowFaceVerification(true);
    // } else {
    //   setShowPositionSelection(true);
    // }
    // setShowFaceVerification(true); // 얼굴인증 창부터 띄우기
    setShowPositionSelection(true); // 얼굴인증 되어서 포지션선택창만 띄우게 일단 설정
  };

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position || null);
  };

  const handleMatchStart = (position: string) => {
    console.log("매칭 시작", position);
    setShowPositionSelection(false);
    setShowMatching(true);
    // 여기에 실제 매칭 로직을 추가할 수 있습니다.
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
              className="mt-10 h-16 w-40 rounded-md bg-custom-purple-color py-3 font-bold text-white shadow-btn text-stroke-custom"
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
        onPositionSelect={handlePositionSelect}
        onMatchStart={handleMatchStart}
      />
      <Matching isOpen={showMatching} onClose={() => setShowMatching(false)} />
    </div>
  );
};

export default GameHome;
