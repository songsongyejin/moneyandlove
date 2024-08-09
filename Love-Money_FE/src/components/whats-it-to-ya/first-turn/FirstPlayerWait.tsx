import React from "react";
import Card from "../game-elements/PriorityCard";

interface CardType {
  id: string;
  number: number;
}

interface FirstPlayerWaitProps {
  dropZones: CardType[][];
  wordCards: { id: string; word: string; bgColor: string; textColor: string }[];
}

const FirstPlayerWait: React.FC<FirstPlayerWaitProps> = ({
  dropZones,
  wordCards,
}) => {
  return (
    <div className="relative flex h-screen w-full flex-col justify-end">
      {/* 게임 영역 */}
      <div className="fixed top-0 flex w-full flex-col items-center justify-center">
        {/* 설명 영역 */}
        <div className="mb-10 mt-10 flex flex-col items-center">
          <div
            className="mx-auto flex flex-col justify-center rounded-lg border-2 border-dashed border-custom-purple-color bg-white px-10 py-4 text-center"
            style={{
              fontFamily: "DungGeunMo",
              width: "780px",
            }}
          >
            <p className="mb-2 text-xl">
              상대방이 당신의 우선순위를 맞추는 중입니다
            </p>
            <p className="text-xl"> 잠시만 기다려주세요 </p>
          </div>
          <div className="flex animate-fadeIn flex-col items-center justify-center">
            <div
              className="mb-20 mt-16 animate-pulse text-4xl text-custom-purple-color"
              style={{ fontFamily: "DungGeunMo" }}
            >
              상대방이 맞추는 중..
            </div>
          </div>
        </div>

        {/* 다섯 개의 단어 카드 영역 */}
        <div
          className="table-container"
          style={{ position: "fixed", bottom: "26%" }}
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
      </div>
    </div>
  );
};

export default FirstPlayerWait;
