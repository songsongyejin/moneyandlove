import React, { useState, useEffect } from "react";
import select from "../../assets/select.png";
import nonSelect from "../../assets/nonSelect.png";
import loveSelect from "../../assets/loveSelect.png";
import moneySelect from "../../assets/moneySelect.png";
import GameStartModal from "../home/gameStartModal";
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
    { name: "money", icon: moneySelect, isSelect: nonSelect },
    { name: "love", icon: loveSelect, isSelect: nonSelect },
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
    <GameStartModal isOpen={isOpen} onClose={onClose} title="포지션 선택">
      <div className="flex w-full flex-col items-center">
        <p
          className="mb-10 text-xl font-bold"
          style={{ fontFamily: "DungGeunMo" }}
        >
          당신의 플레이 포지션을 선택해주세요!
        </p>
        <div className="mb-12 flex w-full justify-evenly">
          {positions.map((position) => (
            <button
              key={position.name}
              onClick={() => handlePositionClick(position.name)}
              className={`flex w-40 flex-col items-center rounded-lg border-4 border-solid border-black p-4 text-black shadow-btn ${
                tempSelectedPosition === position.name
                  ? (position.isSelect = select)
                  : `hover:scale-105`
              }`}
            >
              <div className="flex w-full">
                <img src={position.isSelect} alt="" className="h-32 w-32" />
                <img
                  src={position.icon}
                  alt={`${position.name} icon`}
                  className="-ml-9 -mt-7 h-20 w-20"
                />
              </div>

              <span
                style={{
                  fontFamily: "DNFBitBitv2",
                  WebkitTextStroke: "0.01px #8B6CAC",
                }}
                className=""
              >
                {position.name}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={handleConfirm}
          disabled={!tempSelectedPosition}
          className={`active:brightness-90" rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white shadow-btn transition-all duration-300 ease-in-out hover:brightness-110 ${
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
    </GameStartModal>
  );
};

export default PositionSelection;
