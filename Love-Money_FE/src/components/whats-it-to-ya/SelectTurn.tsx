import React, { useState, useEffect } from "react";
import cardBack from "../../assets/cards/card_back.svg";
import cardFirstTurn from "../../assets/cards/first_turn_card.png";
import cardSecondTurn from "../../assets/cards/second_turn_card.png";

interface SelectTurnProps {
  onTurnSelected: (cardIndex: number) => void;
}

const SelectTurn: React.FC<SelectTurnProps> = ({ onTurnSelected }) => {
  // 카드의 뒤집힘 상태를 관리하는 state
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  // 카드가 선택되었는지 여부를 관리하는 state
  const [isCardSelected, setIsCardSelected] = useState(false);

  // 카드 클릭 핸들러
  // 사용자가 선, 후 카드 선택했을 때
  const handleCardClick = (cardIndex: number) => {
    if (!isCardSelected) {
      setFlippedCard(cardIndex); // 카드가 뒤집어지도록 함
      setIsCardSelected(true); // 카드선택완료상태로 변경
      // 카드 선택번호가 1이면 선, 2이면 후인거임
      console.log(`선택한 카드번호 ${cardIndex}`);
    }
  };

  // 카드 선택 후 2초 뒤에 onTurnSelected 함수를 호출해서, 다음 페이지로 이동하게끔 함
  useEffect(() => {
    if (isCardSelected && flippedCard !== null) {
      const timer = setTimeout(() => {
        onTurnSelected(flippedCard);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCardSelected, onTurnSelected, flippedCard]);
  // useEffect 훅의 두 번째 매개변수로 전달된 배열은 의존성 배열
  // 이 배열에 포함된 값이 변경될 때마다 useEffect가 다시 실행됨
  // isCardSelected, onTurnSelected, flippedCard의 변경을 감지하여 해당 로직이 필요할 때만 실행되도록 함

  return (
    <div className="flex h-screen flex-col justify-between">
      {/* 설명 영역 */}
      <div className="mt-10 flex flex-col items-start">
        <div
          className="flex animate-fadeIn flex-col justify-center rounded-lg border-2 border-dashed border-custom-purple-color bg-white px-10 py-14 text-center"
          style={{
            fontFamily: "DungGeunMo",
            width: "600px",
          }}
        >
          <p className="mb-3 text-2xl">왓츠잇투야 게임이 곧 시작됩니다!</p>
          <p className="text-2xl">게임의 순서를 위해 카드를 골라주세요</p>
        </div>
      </div>
      {/* 카드 선택 영역 */}
      <div className="mb-10 flex justify-center">
        <div className="flip-card-container flex animate-fadeIn flex-row space-x-20">
          {/* 첫 번째 카드 */}
          <div
            className={`flip-card cursor-pointer ${flippedCard === 1 ? "flipped" : ""}`}
            onClick={() => handleCardClick(1)}
          >
            <div className="flip-card-inner hover:scale-105">
              <div className="flip-card-front">
                <img
                  src={cardBack}
                  alt="첫 번째 카드 뒷면인 상태"
                  className="h-[228px] w-[165px] object-contain"
                />
              </div>
              <div className="flip-card-back">
                <img
                  src={cardFirstTurn}
                  alt="첫 번째 카드 앞면"
                  className="h-[228px] w-[165px] rounded-lg object-contain"
                />
              </div>
            </div>
          </div>
          {/* 두 번째 카드 */}
          <div
            className={`flip-card cursor-pointer ${flippedCard === 2 ? "flipped" : ""}`}
            onClick={() => handleCardClick(2)}
          >
            <div className="flip-card-inner hover:scale-105">
              <div className="flip-card-front">
                <img
                  src={cardBack}
                  alt="두 번째 카드 뒷면"
                  className="h-[228px] w-[165px] object-contain"
                />
              </div>
              <div className="flip-card-back">
                <img
                  src={cardSecondTurn}
                  alt="두 번째 카드 앞면"
                  className="h-[228px] w-[165px] rounded-lg object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTurn;
