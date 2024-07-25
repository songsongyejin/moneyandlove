import React, { useState } from "react";
import BaseModal from "../home/BaseModal";

interface PositionSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onPositionSelect: (position: string) => void;
  onMatchStart: (position: string) => void;
}

const PositionSelection: React.FC<PositionSelectionProps> = ({
  isOpen,
  onClose,
  onPositionSelect,
  onMatchStart,
}) => {
  const positions = ["MAFIA", "LOVE"];
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handlePositionClick = (position: string) => {
    setSelectedPosition(position);
  };

  const handleConfirm = () => {
    if (selectedPosition) {
      setIsConfirmed(true);
      onPositionSelect(selectedPosition); // 부모 컴포넌트에 선택된 포지션 전달
    }
  };

  const handleMatchStart = () => {
    if (selectedPosition) {
      onMatchStart(selectedPosition);
      // // 매칭 시작 후 상태 초기화
      // setSelectedPosition(null);
      // setIsConfirmed(false);
    }
  };

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    setSelectedPosition(null);
    setIsConfirmed(false);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="포지션 선택">
      <div className="flex flex-col items-center">
        {!isConfirmed ? (
          <>
            <p className="mb-4">플레이할 포지션을 선택해주세요.</p>
            <div className="mb-6 flex space-x-4">
              {positions.map((position) => (
                <button
                  key={position}
                  onClick={() => handlePositionClick(position)}
                  className={`rounded px-6 py-2 text-white ${
                    selectedPosition === position
                      ? "bg-purple-600"
                      : "bg-purple-400 hover:bg-purple-500"
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
            <button
              onClick={handleConfirm}
              disabled={!selectedPosition}
              className={`rounded px-6 py-2 text-white ${
                selectedPosition
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              선택하기
            </button>
          </>
        ) : (
          <>
            <p className="mb-6 text-xl font-bold">
              현재 포지션 {selectedPosition}
            </p>
            <button
              onClick={handleMatchStart}
              className="rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600"
            >
              매칭 시작
            </button>
          </>
        )}
      </div>
    </BaseModal>
  );
};

export default PositionSelection;
