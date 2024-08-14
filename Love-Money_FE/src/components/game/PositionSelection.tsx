import React, { useState, useEffect } from "react";
import BaseModal from "../home/BaseModal";
import moneyIcon from "../../assets/money.svg";
import loveIcon from "../../assets/love.svg";

interface PositionSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPosition: string | null;
  onPositionSelect: (position: string) => void;
}

const PositionSelection: React.FC<PositionSelectionProps> = ({
  isOpen,
  onClose,
  selectedPosition,
  onPositionSelect,
}) => {
  const positions = [
    { name: "money", icon: moneyIcon },
    { name: "love", icon: loveIcon },
  ];
  const [tempSelectedPosition, setTempSelectedPosition] = useState<
    string | null
  >(null);

  useEffect(() => {
    // 모달이 열릴 때마다 tempSelectedPosition을 초기화
    if (isOpen) {
      setTempSelectedPosition(null);
    }
  }, [isOpen]);

  const handlePositionClick = (position: string) => {
    setTempSelectedPosition(position);
  };

  const handleConfirm = () => {
    if (tempSelectedPosition) {
      onPositionSelect(tempSelectedPosition);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="포지션 선택">
      <div className="flex flex-col items-center">
        <p className="mb-8 text-xl" style={{ fontFamily: "DungGeunMo" }}>
          당신의 플레이 포지션을 선택해주세요!
        </p>
        <div className="mb-12 flex space-x-6">
          {positions.map((position) => (
            <button
              key={position.name}
              onClick={() => handlePositionClick(position.name)}
              className={`flex flex-col items-center rounded-lg px-20 py-12 text-black ${
                tempSelectedPosition === position.name
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
          disabled={!tempSelectedPosition}
          className={`active:brightness-90" rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110 ${
            tempSelectedPosition
              ? "bg-custom-purple-color hover:bg-purple-950"
              : "cursor-not-allowed bg-gray-300"
          }`}
          style={{
            fontFamily: "DNFBitBitv2",
          }}
        >
          선택하기
        </button>
      </div>
    </BaseModal>
  );
};

export default PositionSelection;
