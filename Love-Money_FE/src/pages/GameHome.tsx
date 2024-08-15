import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useGameLogic } from "../hooks/useGameLogic";
import { userInfo, userToken } from "../atom/store";
import heartIcon from "../assets/start_heart_icon.svg";
import "../index.css";
import mainBg from "../assets/moveBg2.gif";
import mainBgMoney from "../assets/mafia_bg.png";
import mainBgLove from "../assets/love_bg.jpg";
import cat from "../assets/cat.png";
import exclamation from "../assets/exclamation.png";
import FriendsSideBar from "../components/FriendsSideBar/FriendsSideBar";
import FaceVerification from "../components/game/FaceVerification";
import PositionSelection from "../components/game/PositionSelection";
import GameModeSelection from "../components/game/GameModeSelection";
import Matching from "../components/game/Matching";
import Navbar from "../components/Header/Navbar";
import { useQuery } from "@tanstack/react-query";
import { fetchUserData } from "../utils/user";
import { fetchFriendsListData } from "../utils/friends";
import { matching } from "../utils/matchingAPI";
import NoticeModal from "../components/home/NoticeModal";

const GameHome: React.FC = () => {
  const token = useRecoilValue(userToken);
  const [user, setUser] = useRecoilState(userInfo);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false); // NoticeModal 상태 관리

  const { data } = useQuery({
    queryKey: ["userData", token],
    queryFn: () => fetchUserData(token as string),
    enabled: !!token,
  });

  const { data: friendsList } = useQuery({
    queryKey: ["friendsList", token],
    queryFn: () => fetchFriendsListData(token as string),
    enabled: !!token,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  const {
    showFaceVerification,
    setShowFaceVerification,
    showPositionSelection,
    setShowPositionSelection,
    selectedPosition,
    gameMode,
    setSelectedPosition,
    showGameModeSelection,
    setShowGameModeSelection,
    showMatching,
    setShowMatching,
    handleGameStart,
    handleGameModeSelectionClose,
    handlePositionSelect,
    handleGameModeSelect,
    handleBackToPositionSelect,
    handleMatchStart,
    handleMatchingCancel,
    showMatchComplete,
    handleMatchComplete,
  } = useGameLogic();

  const getBackgroundClass = () => {
    if (selectedPosition === "MONEY") return mainBgLove;
    if (selectedPosition === "LOVE") return mainBgLove;
    return mainBg;
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative h-screen">
      <Navbar />
      <img
        src={getBackgroundClass()}
        alt=""
        className={`absolute inset-0 h-screen w-screen object-center`}
      />
      <div className="absolute inset-0 bg-black opacity-35"></div>
      <div className="relative flex h-full items-center justify-center">
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
            진정한 사랑을 찾는 새로운 연애 심리 게임
          </p>
          {/* 게임 시작 버튼 */}
          <div className="hvr-float-shadow fixed right-[11%] top-[52%] inline-block rotate-12 transform">
            <button
              onClick={handleGameStart}
              className="mt-10 h-16 w-40 rounded-md bg-transparent py-3 font-bold text-white text-stroke-custom hover:scale-110"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span
                className={`text-3xl ${isHovered ? "" : "text-flicker-in-glow"}`}
                style={{
                  fontFamily: "DNFBitBitv2",
                }}
              >
                Game Start
              </span>
            </button>
          </div>
        </div>
        {/* 고양이 이미지가 있는 div 클릭 시 NoticeModal을 열기 */}
        <div
          className="absolute bottom-5 left-96 flex w-24 cursor-pointer hover:scale-110"
          onClick={() => setIsNoticeModalOpen(true)}
        >
          <img src={cat} alt="cat" />
          <img
            src={exclamation}
            alt="exclamation"
            className="blink-1 -ml-7 -mt-7 h-14 w-14"
          />
        </div>
      </div>

      {/* NoticeModal */}
      <NoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="공지사항"
      />

      {/* 포지션 선택 모달 */}
      <PositionSelection
        isOpen={showPositionSelection}
        onClose={() => {
          setShowPositionSelection(false);
        }}
        selectedPosition={selectedPosition}
        onPositionSelect={handlePositionSelect}
      />

      {/* 게임 모드 선택 모달 */}
      <GameModeSelection
        isOpen={showGameModeSelection}
        onClose={handleGameModeSelectionClose}
        onModeSelect={handleGameModeSelect}
        onBackToPositionSelect={handleBackToPositionSelect}
        selectedPosition={selectedPosition || ""}
      />

      {/* 매칭 모달 */}
      {selectedPosition && gameMode && token && (
        <Matching
          isOpen={showMatching}
          onClose={handleMatchingCancel}
          token={token}
          selectedPosition={selectedPosition}
          gameMode={gameMode}
        />
      )}
    </div>
  );
};

export default GameHome;
