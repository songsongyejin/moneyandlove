import React, { useEffect } from "react";
import Card from "../game-elements/PriorityCard";
import Card2 from "../game-elements/PriorityCard2";

// FirstTurnScore

interface CardType {
  id: string;
  number: number;
}

interface ScoreProps {
  player1DropZones: CardType[][];
  player2GuessZones: CardType[][];
  onScoreCalculated: (score: number) => void;
  onNextPhase: () => void;
  wordCards: { id: string; word: string; bgColor: string; textColor: string }[];
}

const TempScore: React.FC<ScoreProps> = ({
  player1DropZones,
  player2GuessZones,
  onScoreCalculated,
  onNextPhase,
  wordCards,
}) => {
  // 점수 계산 로직
  const calculateScore = () => {
    let score = 0;

    for (let i = 0; i < player1DropZones.length; i++) {
      // 각 드랍존에는 한 장의 카드만 있음
      const player1Card = player1DropZones[i][0];
      const player2Card = player2GuessZones[i][0];

      if (
        player1Card &&
        player2Card &&
        player1Card.number === player2Card.number
      ) {
        score += 1; // 동일한 위치에 동일한 숫자의 카드가 있으면 점수를 증가
      }
    }

    return score;
  };
  // 점수 계산 후 부모 컴포넌트로 전달
  useEffect(() => {
    const score = calculateScore();
    onScoreCalculated(score); // 점수를 콜백 함수로 전달
  }, [player1DropZones, player2GuessZones, onScoreCalculated]);

  const score = calculateScore();

  return (
    <div className="relative flex h-screen flex-col items-center justify-between">
      {/* 점수 표시 */}
      <div
        className="absolute flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
        style={{
          fontFamily: "DungGeunMo",
          top: "10%", // 텍스트 위치를 적절히 조정
        }}
      >
        <div>
          <p className="deep-3d-text mb-3 text-2xl">
            내가 맞춘 상대방의 우선순위 개수
          </p>
          <p className="deep-3d-text text-2xl">{score} 개</p>
        </div>
      </div>

      <div
        className="fixed flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
        style={{
          fontFamily: "DungGeunMo",
          bottom: "37%",
        }}
      >
        <div>
          <p
            className="deep-3d-text mb-3 text-2xl"
            style={{ transform: "rotateX(30deg)" }}
          >
            상대방의 선택
          </p>
        </div>
      </div>

      {/* Player 1의 드랍존 카드들 */}
      <div
        className="drop-table-container mt-10 flex animate-fadeIn flex-col items-center"
        style={{ position: "fixed", bottom: "30%" }}
      >
        <div className="drop-card-container flex" style={{ gap: "4.3rem" }}>
          {player1DropZones.map((zone, index) => (
            <div
              key={index}
              className="drop-card-you flex flex-col items-center"
            >
              {zone.map((card) => (
                <Card key={card.id} id={card.id} number={card.number} />
              ))}
            </div>
          ))}
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
          {wordCards.map((card) => (
            <div
              key={card.id}
              className="word-card border-3 flex flex-col items-center justify-center rounded-xl shadow-md"
              style={{
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
      </div>

      <div
        className="fixed flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
        style={{
          fontFamily: "DungGeunMo",
          bottom: "14%",
        }}
      >
        <div>
          <p
            className="deep-3d-text mb-3 text-2xl"
            style={{ transform: "rotateX(30deg)" }}
          >
            나의 예측
          </p>
        </div>
      </div>
      {/* Player 2의 예측 카드들 */}
      <div
        className="drop-table-container flex animate-fadeIn flex-col items-center"
        style={{ position: "fixed", bottom: "7%" }}
      >
        <div className="drop-card-container flex" style={{ gap: "9.3rem" }}>
          {player2GuessZones.map((zone, index) => (
            <div
              key={index}
              className="drop-card-me z-50 flex flex-col items-center"
            >
              {zone.map((card) => (
                <Card2 key={card.id} id={card.id} number={card.number} />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* 다음으로 넘어가는 버튼 */}
      <div className="fixed bottom-7">
        <button
          onClick={onNextPhase}
          className="three-d-button reset"
          style={{ fontFamily: "DungGeunMo" }}
        >
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default TempScore;
