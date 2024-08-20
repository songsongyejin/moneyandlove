import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface SecondPlayerWaitProps {
  wordCards: { id: string; word: string; bgColor: string; textColor: string }[];
}

const SecondPlayerWait: React.FC<SecondPlayerWaitProps> = ({ wordCards }) => {
  return (
    <DndProvider backend={HTML5Backend}>
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
            <p className="deep-3d-text mb-3 text-2xl">
              상대방이 단어카드를 보고 가치관에 따른 우선순위를 정하는 중입니다.
            </p>
            <p className="deep-3d-text mb-3 text-2xl">
              하단의 단어카드에 커서를 올려 자세히 확인해보세요.
            </p>
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
                  animationDelay: `${index * 0.1}s`,
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
        {/* 로딩 스피너 추가 */}
        <div className="spinner fixed bottom-10"></div>
      </div>
    </DndProvider>
  );
};

export default SecondPlayerWait;
