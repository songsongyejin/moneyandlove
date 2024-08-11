// components/whats-it-to-ya/FinalSelection.tsx
import React, { useState } from "react";
import { FaHeart, FaDollarSign } from "react-icons/fa";

interface FinalSelectionProps {
  onNextPhase: (selection: "Love" | "Money") => void;
}
const FinalSelection: React.FC<FinalSelectionProps> = ({ onNextPhase }) => {
  const [selectedPosition, setSelectedPosition] = useState<
    "Love" | "Money" | null
  >(null);

  const handleSelection = (position: "Love" | "Money") => {
    setSelectedPosition(position);
  };

  const handleNextPhase = () => {
    if (selectedPosition) {
      onNextPhase(selectedPosition);
    } else {
      alert("포지션을 반드시 선택해주세요!");
    }
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center">
      <div
        className="absolute flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
        style={{ fontFamily: "DungGeunMo", bottom: "30%" }}
      >
        <div>
          <p className="deep-3d-text mb-3 text-4xl">최종 선택의 시간입니다.</p>
          <p className="deep-3d-text mb-3 text-2xl">
            당신의 포지션을 선택해주세요!
          </p>
        </div>
      </div>

      <div className="fixed bottom-24">
        {/* Love와 Money 선택 카드들 */}
        <div className="select-card-container">
          <div
            className={`select-card ${selectedPosition === "Love" ? "selected" : ""}`}
            onClick={() => handleSelection("Love")}
          >
            <FaHeart size={60} />
            <p className="mt-2">LOVE</p>
          </div>

          <div
            className={`select-card ${selectedPosition === "Money" ? "selected" : ""}`}
            onClick={() => handleSelection("Money")}
          >
            <FaDollarSign size={60} />
            <p className="mt-2">MONEY</p>
          </div>
        </div>
      </div>

      {/* 다음으로 넘어가는 버튼 */}
      <div className="fixed bottom-10">
        <button
          onClick={handleNextPhase}
          className="three-d-button reset"
          style={{ fontFamily: "DungGeunMo" }}
        >
          최종결과확인
        </button>
      </div>
    </div>
  );
};

export default FinalSelection;
