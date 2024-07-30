import React, { useState, useEffect } from "react";
import cardBack from "../../assets/cards/card_back.svg";
import cardFirstTurn from "../../assets/cards/card_first_turn.svg";
import cardSecondTurn from "../../assets/cards/card_second_turn.svg";

interface SelectTurnProps {
  onTurnSelected: () => void;
}

const SelectTurn: React.FC<SelectTurnProps> = ({ onTurnSelected }) => {
  const [isFlippedFirst, setIsFlippedFirst] = useState(false);
  const [isFlippedSecond, setIsFlippedSecond] = useState(false);
  const [isCardSelected, setIsCardSelected] = useState(false);

  const handleFlipFirst = () => {
    setIsFlippedFirst(!isFlippedFirst);
    setIsCardSelected(true);
  };

  const handleFlipSecond = () => {
    setIsFlippedSecond(!isFlippedSecond);
    setIsCardSelected(true);
  };

  useEffect(() => {
    if (isCardSelected) {
      const timer = setTimeout(() => {
        onTurnSelected();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCardSelected, onTurnSelected]);

  return (
    <div className="relative flex h-[620px] w-[900px] flex-col rounded-[20px] bg-[#F0E9F6]">
      {/* 제목 박스 */}
      <div className="absolute -top-5 left-1/2 flex h-[50px] w-[250px] -translate-x-1/2 items-center justify-center rounded-3xl bg-[#8B6CAC]">
        <h1
          className="text-xl text-white"
          style={{ fontFamily: "DNFBitBitv2" }}
        >
          What's it to ya
        </h1>
      </div>
      {/* 턴 선택 영역 */}
      <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <div
            className="mx-auto mb-14 flex flex-col justify-center rounded-lg border-2 border-dashed border-custom-purple-color bg-white px-10 py-14 text-center"
            style={{
              fontFamily: "DungGeunMo",
              width: "600px",
            }}
          >
            <p className="mb-3 text-xl">게임이 곧 시작됩니다!</p>
            <p className="text-xl">게임의 순서를 위해 카드를 골라주세요</p>
          </div>
          <div className="card-container flex flex-row space-x-20">
            <div
              className={`flip-card cursor-pointer ${isFlippedFirst ? "flipped" : ""}`}
              onClick={handleFlipFirst}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img
                    src={cardBack}
                    alt="카드 뒷면"
                    className="h-[228px] w-[165px] object-contain"
                  />
                </div>
                <div className="flip-card-back">
                  <img
                    src={cardFirstTurn}
                    alt="첫 번째 카드 앞면"
                    className="h-[228px] w-[165px] object-contain"
                  />
                </div>
              </div>
            </div>
            <div
              className={`flip-card cursor-pointer ${isFlippedSecond ? "flipped" : ""}`}
              onClick={handleFlipSecond}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img
                    src={cardBack}
                    alt="카드 뒷면"
                    className="h-[228px] w-[165px] object-contain"
                  />
                </div>
                <div className="flip-card-back">
                  <img
                    src={cardSecondTurn}
                    alt="두 번째 카드 앞면"
                    className="h-[228px] w-[165px] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTurn;
