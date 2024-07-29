import React, { useState } from "react";
import BaseModal from "../home/BaseModal";

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

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleConfirm = () => {
    if (selectedMode) {
      onModeSelect(selectedMode);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="게임 모드 선택">
      <div className="flex flex-col items-center">
        <p className="mb-4 text-xl">현재 포지션: {selectedPosition}</p>
        <div className="mb-6 space-y-4">
          <button
            onClick={() => handleModeSelect("일반")}
            className={`w-full rounded-lg px-4 py-2 ${
              selectedMode === "일반"
                ? "bg-custom-purple-color text-white"
                : "bg-gray-200"
            }`}
          >
            일반 모드
          </button>
          <button
            onClick={() => handleModeSelect("러브")}
            className={`w-full rounded-lg px-4 py-2 ${
              selectedMode === "러브"
                ? "bg-custom-purple-color text-white"
                : "bg-gray-200"
            }`}
          >
            러브 모드
          </button>
          <button
            onClick={() => handleModeSelect("프리미엄")}
            className={`w-full rounded-lg px-4 py-2 ${
              selectedMode === "프리미엄"
                ? "bg-custom-purple-color text-white"
                : "bg-gray-200"
            }`}
          >
            프리미엄 모드
          </button>
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
            disabled={!selectedMode}
            className={`rounded px-4 py-2 text-white ${
              selectedMode
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
