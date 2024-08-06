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
    <div className="flex h-screen w-full items-center justify-center">
      {/* 게임창 */}
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
        {/* 게임 영역 */}
        <div className="mb-14 mt-7 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            {/* 설명 영역 */}
            <div
              className="mx-auto mt-5 flex flex-col justify-center rounded-lg border-2 border-dashed border-custom-purple-color bg-white px-10 py-4 text-center"
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
            {/* 다섯 개의 단어 카드 영역 */}

            <div className="card-container mt-8 flex flex-row space-x-8">
              {wordCards.map((card) => (
                <div
                  key={card.id}
                  className="border-3 flex flex-col items-center justify-center rounded-xl shadow-md"
                  style={{
                    width: "135px",
                    height: "180px",
                    backgroundColor: card.bgColor,
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

            <div className="mt-8 flex" style={{ gap: "5.5rem" }}>
              {dropZones.map((zone, index) => (
                <div key={index}>
                  {zone.map((card) => (
                    <Card key={card.id} id={card.id} number={card.number} />
                  ))}
                </div>
              ))}
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
        </div>
      </div>
    </div>
  );
};

export default FirstPlayerWait;
