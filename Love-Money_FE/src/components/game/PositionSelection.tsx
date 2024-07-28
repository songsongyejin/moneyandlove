import React, { useState } from "react";
import BaseModal from "../home/BaseModal";
import moneyIcon from "../../assets/money.svg";
import loveIcon from "../../assets/love.svg";

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
  const positions = [
    { name: "MONEY", icon: moneyIcon },
    { name: "LOVE", icon: loveIcon },
  ];
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handlePositionClick = (position: string) => {
    setSelectedPosition(position);
  };

  const handleConfirm = () => {
    if (selectedPosition) {
      setIsConfirmed(true);
      onPositionSelect(selectedPosition); // 부모 컴포넌트(GameHome)에 사용자에 의해 선택된 포지션 전달
    }
  };

  //
  const handleMatchStart = () => {
    if (selectedPosition) {
      onMatchStart(selectedPosition);
      // 매칭 시작 후 상태 초기화
      // setSelectedPosition(null);
      // setIsConfirmed(false);
    }
  };

  // 포지션 선택 후 매칭 시작 모달에서 뒤로가기
  const handleBack = () => {
    setIsConfirmed(false);
    onPositionSelect("");
  };

  // 포지션 선택 모달이 닫힐 때 사용자 포지션 상태 초기화
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
            <p className="mb-8 text-xl" style={{ fontFamily: "DungGeunMo" }}>
              당신의 플레이 포지션을 선택해주세요!
            </p>
            <div className="mb-12 flex space-x-6">
              {positions.map((position) => (
                <button
                  key={position.name}
                  onClick={() => handlePositionClick(position.name)}
                  className={`flex flex-col items-center rounded-lg px-20 py-12 text-black ${
                    selectedPosition === position.name
                      ? "bg-custom-purple-color"
                      : "bg-white hover:bg-custom-purple-color"
                  }`}
                >
                  <img
                    src={position.icon}
                    alt={`${position.name} icon`}
                    className="mb-8 h-16 w-16"
                  />
                  <span
                    style={{
                      fontFamily: "DNFBitBitv2",
                      WebkitTextStroke: "0.01px #8B6CAC",
                    }}
                  >
                    {position.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={handleConfirm}
              disabled={!selectedPosition}
              className={`active:brightness-90" rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110 ${
                selectedPosition
                  ? "bg-custom-purple-color hover:bg-purple-950"
                  : "cursor-not-allowed bg-gray-300"
              }`}
              style={{
                fontFamily: "DNFBitBitv2",
              }}
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
            <button
              onClick={handleBack}
              className="mt-4 rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
            >
              포지션 다시 선택
            </button>
          </>
        )}
      </div>
    </BaseModal>
  );
};

export default PositionSelection;
