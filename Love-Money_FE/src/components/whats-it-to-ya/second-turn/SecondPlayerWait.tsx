import React from "react";
import Card from "../game-elements/PriorityCard2";

interface CardType {
  id: string;
  number: number;
}

interface SecondPlayerWaitProps {
  dropZones: CardType[][];
  wordCards: { id: string; word: string; bgColor: string; textColor: string }[];
}

const SecondPlayerWait: React.FC<SecondPlayerWaitProps> = ({
  dropZones,
  wordCards,
}) => {
  return (
    <div className="relative flex h-screen flex-col items-center justify-between">
      {/* 설명 영역 */}
      <div
        className="absolute flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
        style={{
          fontFamily: "DungGeunMo",
          top: "60%",
        }}
      >
        <div>
          <p className="deep-3d-text mb-3 text-4xl">
            상대방이 당신의 우선순위를 맞추는 중입니다.
          </p>
          <p className="deep-3d-text mb-3 text-4xl">잠시만 기다려주세요!</p>
        </div>
      </div>

      {/* 다섯 개의 단어 카드 영역 */}
      <div
        className="table-container"
        style={{ position: "fixed", bottom: "25%" }}
      >
        <div
          className="word-card-container flex flex-row"
          style={{ gap: "3rem" }}
        >
          {wordCards.map((card, index) => (
            <div
              key={card.id}
              className="word-card border-3 flex flex-col items-center justify-center rounded-xl shadow-md"
              style={{
                backgroundColor: card.bgColor,
                animationDelay: `${index * 0.1}s`, // Stagger the animation
              }}
            >
              {/* 상단 영역 */}
              <div className="h-12 w-full rounded-xl rounded-b-none"></div>
              {/* 본문 영역 */}
              <div className="flex w-full flex-1 flex-col items-center justify-center bg-white">
                <p
                  className="text-2xl"
                  style={{
                    fontFamily: "DungGeunMo",
                    color: card.textColor,
                  }}
                >
                  {card.word}
                </p>
              </div>

              {/* 하단 영역 */}
              <div className="flex h-12 w-full items-center justify-center rounded-xl rounded-t-none">
                <p
                  className="text-base"
                  style={{ fontFamily: "DungGeunMo", color: "white" }}
                >
                  MONEY & LOVE
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 내가 선택한 우선순위 영역 */}
      <div
        className="drop-table-container animate-fadeIn rounded-lg"
        style={{ position: "fixed", bottom: "7%" }}
      >
        <div
          className="drop-card-container flex justify-center"
          style={{ gap: "9.1rem", transform: "rotateX(60deg)" }}
        >
          {dropZones.map((zone, index) => (
            <div key={index}>
              {zone.map((card) => (
                <Card key={card.id} id={card.id} number={card.number} />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* 로딩 스피너 추가 */}
      <div className="spinner fixed bottom-3"></div>
    </div>
  );
};

export default SecondPlayerWait;
