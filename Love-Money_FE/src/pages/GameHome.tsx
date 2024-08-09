import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useGameLogic } from "../hooks/useGameLogic";
import { userInfo, userToken } from "../atom/store";
// 필요한 아이콘과 CSS 파일을 import
import heartIcon from "../assets/start_heart_icon.svg";
import "../index.css";
import mainBg from "../assets/main_bg.png";
import mainBgMoney from "../assets/mafia_bg.png";
import mainBgLove from "../assets/love_bg.jpg";

// 필요한 컴포넌트들을 import
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

const GameHome: React.FC = () => {
  // Recoil을 사용하여 사용자 정보 상태를 가져옴
  const token = useRecoilValue(userToken);
  const [user, setUser] = useRecoilState(userInfo);
  type friendProfile = {
    followerId: number;
    nickname: string;
    age: number;
    gender: string;
    img: string;
    chatRoomId: number;
  };

  const { data, error, isLoading } = useQuery({
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

  //Chat Socket 통신
  type chatType = {
    roomId: number;
    senderId: number;
    message: string;
    createdAt: string;
  };

  // useGameLogic 훅을 사용하여 게임 로직 관련 상태와 함수들을 가져옴
  const {
    showFaceVerification, // 얼굴 인증 모달의 표시 여부
    setShowFaceVerification,
    showPositionSelection, // 포지션 선택 모달의 표시 여부
    setShowPositionSelection,
    selectedPosition, // 현재 선택된 포지션
    gameMode,
    setSelectedPosition,
    showGameModeSelection, // 게임 모드 선택 모달의 표시 여부
    setShowGameModeSelection,
    showMatching, // 매칭 모달의 표시 여부
    setShowMatching,
    handleGameStart, // 게임 시작 버튼 클릭 시 호출되는 함수
    handleGameModeSelectionClose,
    handlePositionSelect, // 포지션 선택 시 호출되는 함수
    handleGameModeSelect, // 게임 모드 선택 시 호출되는 함수
    handleBackToPositionSelect, // 게임 모드 선택에서 포지션 선택으로 되돌아가는 함수
    handleMatchStart, // 매칭 시작 시 호출되는 함수
    handleMatchingCancel, // 매칭 취소 시 호출되는 함수
    showMatchComplete,
    handleMatchComplete,
  } = useGameLogic();
  console.log(selectedPosition);
  console.log(gameMode);

  const { data: s } = useQuery({
    queryKey: ["matching", token, selectedPosition, gameMode],
    queryFn: () =>
      matching(token as string, selectedPosition as string, gameMode as string),
    enabled: !!token && showMatching,
  });
  console.log(s);
  // 선택된 포지션에 따라 배경 클래스를 결정하는 함수
  const getBackgroundClass = () => {
    if (selectedPosition === "MONEY") return mainBgLove;
    if (selectedPosition === "LOVE") return mainBgLove;
    return mainBg;
  };
  return (
    <div className="relative h-screen">
      <Navbar />
      {/* <div
        className={`absolute inset-0 ${getBackgroundClass()} bg-cover bg-center`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div> */}
      <img
        src={getBackgroundClass()}
        alt=""
        className={`absolute inset-0 h-screen w-screen bg-cover bg-center`}
      />
      <div className="absolute inset-0 bg-black opacity-20"></div>
      {/* 메인 콘텐츠 영역 */}
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
            진정한 사랑을 찾는 새로운 러브 심리 게임
          </p>
          {/* 게임 시작 버튼 */}
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

      {/* 얼굴 인증 모달
      <FaceVerification
        isOpen={showFaceVerification}
        onClose={() => setShowFaceVerification(false)}
        onVerificationComplete={() => {
          setShowFaceVerification(false);
          setShowPositionSelection(true);
        }}
      /> */}

      {/* 포지션 선택 모달 */}
      <PositionSelection
        isOpen={showPositionSelection}
        onClose={() => {
          setShowPositionSelection(false);
          // setSelectedPosition(null);
        }}
        selectedPosition={selectedPosition}
        onPositionSelect={handlePositionSelect} // 포지션이 선택되면, 포지션 선택 시 호출되는 함수 실행
      />

      {/* 게임 모드 선택 모달 */}
      <GameModeSelection
        isOpen={showGameModeSelection}
        onClose={handleGameModeSelectionClose}
        onModeSelect={handleGameModeSelect}
        onBackToPositionSelect={handleBackToPositionSelect}
        selectedPosition={selectedPosition || ""} // 게임모드 선택 시 현재 포지션 전달
      />

      {/* 매칭 모달 */}
      <Matching isOpen={showMatching} onClose={handleMatchingCancel} />
    </div>
  );
};

export default GameHome;
