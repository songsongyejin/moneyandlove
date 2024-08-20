// components/whats-it-to-ya/FinalSelection.tsx
import React, { useState, useEffect } from "react";
import coin from "../../assets/cards/coin.png";
import heart from "../../assets/cards/pink_heart_card_back.png";

interface FinalSelectionProps {
  onNextPhase: (selection: "Love" | "Money") => void;
  loading: boolean;
  opponentFinalPosition: "Love" | "Money" | null;
}
const FinalSelection: React.FC<FinalSelectionProps> = ({
  onNextPhase,
  loading,
  opponentFinalPosition,
}) => {
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

  // 상대방의 선택이 도착했을 때, 나도 선택을 완료한 상태라면 바로 다음 단계로 넘어감
  useEffect(() => {
    if (loading && opponentFinalPosition) {
      onNextPhase(selectedPosition as "Love" | "Money");
    }
  }, [opponentFinalPosition, loading, onNextPhase, selectedPosition]);

  return (
    <div className="relative flex h-screen flex-col items-center justify-center">
      {loading ? (
        <div
          className="absolute flex -translate-y-1/2 transform animate-fadeIn flex-col items-center whitespace-nowrap text-center text-white"
          style={{ fontFamily: "DungGeunMo", bottom: "10%" }}
        >
          <p className="deep-3d-text mb-10 text-4xl">
            상대방이 선택 중입니다...
          </p>
          <div className="spinner bottom-3"></div>
        </div>
      ) : (
        <>
          <div
            className="absolute flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
            style={{ fontFamily: "DungGeunMo", bottom: "70%" }}
          >
            <div>
              <p className="deep-3d-text mb-3 text-4xl">
                최종 선택의 시간입니다.
              </p>
              <p className="deep-3d-text mb-3 text-2xl">
                상대방이 자신의 마음을 변화시켰다면 새로운 포지션을 선택하고,
              </p>
              <p className="deep-3d-text mb-3 text-2xl">
                그렇지 않다면 처음 선택한 포지션을 유지하세요.
              </p>
            </div>
          </div>
          <div className="table-image-container fixed bottom-24">
            <div
              className={`table-image-wrapper ${
                selectedPosition === "Love" ? "selected" : ""
              }`}
              onClick={() => handleSelection("Love")}
            >
              <img src={heart} alt="Love" className="table-image" />
              <p className="table-image-text">LOVE</p>
            </div>
            <div
              className={`table-image-wrapper ${
                selectedPosition === "Money" ? "selected" : ""
              }`}
              onClick={() => handleSelection("Money")}
            >
              <img src={coin} alt="Money" className="table-image" />
              <p className="table-image-text">MONEY</p>
            </div>
          </div>
          <div className="fixed bottom-10">
            <button
              onClick={handleNextPhase}
              className="three-d-button reset"
              style={{ fontFamily: "DungGeunMo" }}
            >
              최종선택완료
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FinalSelection;
