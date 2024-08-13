import React, { useState } from "react";
import BaseModal from "../home/BaseModal";
import randomMatch from "../../assets/randomMatch.webp";
import loveMatch from "../../assets/loveMatch.webp";
import premiumMatch from "../../assets/premiumMatch.webp";
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
    <BaseModal isOpen={isOpen} onClose={onClose} title="게임 모드 선택">
      <div
        className="flex flex-col items-center"
        style={{ fontFamily: "DungGeunMo" }}
      >
        {!isEligibleToStart() && selectedMode && (
          <p className="text-red-500">포인트가 부족합니다.</p>
        )}
        <p className="mb-4 text-xl">현재 포지션: {selectedPosition}</p>

        <div className="mb-6 flex w-full">
          <div
            className={`mr-8 cursor-pointer rounded-md shadow-btn hover:scale-110 ${selectedMode == "일반" ? "scale-110 bg-custom-purple-color text-white" : "bg-white"}`}
            onClick={() => handleModeSelect("random")}
          >
            <img src={randomMatch} alt="랜덤" className="w-40 rounded-t-md" />
            <h1 className="my-2 text-xl font-bold">일반 모드</h1>
            <p className="text-sm">랜덤으로</p>
            <p className="text-sm">상대방과 매칭</p>
            <p className="mt-4 text-sm">100p</p>
          </div>
          <div
            className={`mr-8 cursor-pointer rounded-md shadow-btn hover:scale-110 ${selectedMode == "러브" ? "scale-110 bg-custom-purple-color text-white" : "bg-white"}`}
            onClick={() => handleModeSelect("love")}
          >
            <img src={loveMatch} alt="러브" className="w-40 rounded-t-md" />
            <h1 className="my-2 text-xl font-bold">러브 모드</h1>
            <p className="text-sm">포지션이 LOVE인</p>
            <p className="text-sm">상대방과 매칭</p>
            <p className="mt-4 text-sm">500p</p>
          </div>
          <div
            className={`cursor-pointer rounded-md shadow-btn hover:scale-110 ${selectedMode == "프리미엄" ? "scale-110 bg-custom-purple-color text-white" : "bg-white"}`}
            onClick={() => handleModeSelect("top30")}
          >
            <img
              src={premiumMatch}
              alt="프리미엄"
              className="w-40 rounded-t-md"
            />
            <h1 className="my-2 text-xl font-bold">프리미엄 모드</h1>
            <p className="text-sm">얼굴인증 상위 20%</p>
            <p className="text-sm">상대방과 매칭</p>
            <p className="mt-4 text-sm">1000p</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onBackToPositionSelect}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            포지션 다시 선택
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedMode || !isEligibleToStart()}
            className={`rounded px-4 py-2 text-white ${
              selectedMode && isEligibleToStart()
                ? "bg-green-500 hover:bg-green-600"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            매칭 시작
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default GameModeSelection;
