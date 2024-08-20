import React, { useState } from "react";

import randomMode from "../../assets/randomMode.png";
import loveMode from "../../assets/loveMode.png";
import premiumMode from "../../assets/premiumMode.png";
import GameStartModal from "../home/gameStartModal";
import { useRecoilValue } from "recoil";
import { userInfo } from "../../atom/store";

interface GameModeSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onModeSelect: (mode: string) => void;
  onBackToPositionSelect: () => void;
  selectedPosition: string;
}

const GameModeSelection: React.FC<GameModeSelectionProps> = ({
  isOpen,
  onClose,
  onModeSelect,
  onBackToPositionSelect,
  selectedPosition,
}) => {
  const [selectedMode, setSelectedMode] = useState<string>("");
  const user = useRecoilValue(userInfo);

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleConfirm = () => {
    if (selectedMode) {
      onModeSelect(selectedMode);
      setSelectedMode("");
    }
  };

  const isEligibleToStart = () => {
    if (!user) return false; // user 정보가 없는 경우 false 반환
    if (selectedMode === "random" && user.gamePoint >= 100) return true;
    if (selectedMode === "love" && user.gamePoint >= 500) return true;
    if (selectedMode === "top30" && user.gamePoint >= 1000) return true;
    return false;
  };

  return (
    <GameStartModal isOpen={isOpen} onClose={onClose} title="게임 모드 선택">
      <div
        className="flex h-full flex-col items-center justify-evenly py-5"
        style={{ fontFamily: "DungGeunMo" }}
      >
        <p
          className="mb-10 text-xl font-bold"
          style={{ fontFamily: "DungGeunMo" }}
        >
          매칭모드를 선택해주세요!
        </p>

        <div className="flex w-full justify-center">
          <div
            className={`-mr-24 -translate-x-1/2 rotate-[-15deg] transform cursor-pointer transition-transform duration-300 hover:z-10 hover:scale-110 ${
              selectedMode === "random" ? "z-20 scale-110" : ""
            }`}
            onClick={() => handleModeSelect("random")}
            style={{
              transition: "transform 0.3s ease, margin-top 0.3s ease",
              marginTop: selectedMode === "random" ? "-40px" : "0px",
            }}
          >
            <img src={randomMode} alt="랜덤" className="w-40 rounded-t-md" />
          </div>
          <div
            className={`-mt-5 transform cursor-pointer transition-transform duration-300 hover:z-10 hover:scale-110 ${
              selectedMode === "love" ? "z-20 scale-110" : ""
            }`}
            onClick={() => handleModeSelect("love")}
            style={{
              transition: "transform 0.3s ease, margin-top 0.3s ease",
              marginTop: selectedMode === "love" ? "-40px" : undefined, // 조건에 따라 marginTop을 조정
            }}
          >
            <img src={loveMode} alt="러브" className="w-40 rounded-t-md" />
          </div>
          <div
            className={`-ml-24 translate-x-1/2 rotate-[15deg] transform cursor-pointer transition-transform duration-300 hover:z-10 hover:scale-110 ${
              selectedMode === "top30" ? "z-20 scale-110" : ""
            }`}
            onClick={() => handleModeSelect("top30")}
            style={{
              transition: "transform 0.3s ease, margin-top 0.3s ease",
              marginTop: selectedMode === "top30" ? "-40px" : "0px",
            }}
          >
            <img
              src={premiumMode}
              alt="프리미엄"
              className="w-40 rounded-t-md"
            />
          </div>
        </div>

        {/* 포인트 부족 메시지 */}
        {!isEligibleToStart() && selectedMode && (
          <p
            className="z-50 rounded p-2 text-red-700"
            style={{
              position: "absolute",
              bottom: "0%", // 화면 하단에 배치
              left: "50%",
              transform: "translateX(-50%)", // 가운데 정렬
            }}
          >
            포인트가 부족합니다.
          </p>
        )}

        <div className="flex space-x-4">
          <button
            onClick={onBackToPositionSelect}
            className="rounded bg-gray-500 px-4 py-2 text-white shadow-btn hover:bg-gray-600"
          >
            포지션 다시 선택
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedMode || !isEligibleToStart()}
            className={`rounded px-4 py-2 text-white shadow-btn ${
              selectedMode && isEligibleToStart()
                ? "bg-custom-purple-color hover:bg-purple-950"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            매칭 시작
          </button>
        </div>
      </div>
    </GameStartModal>
  );
};

export default GameModeSelection;
