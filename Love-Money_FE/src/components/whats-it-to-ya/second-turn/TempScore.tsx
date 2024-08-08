import React, { useEffect } from "react";
import Card from "../game-elements/PriorityCard";
import Card2 from "../game-elements/PriorityCard2";

// SecondTurnScore

interface CardType {
  id: string;
  number: number;
}

interface ScoreProps {
  player1GuessZones: CardType[][];
  player2DropZones: CardType[][];
  onScoreCalculated: (score: number) => void;
  onNextPhase: () => void;
  wordCards: { id: string; word: string; bgColor: string; textColor: string }[];
}

const Score: React.FC<ScoreProps> = ({
  player1GuessZones,
  player2DropZones,
  onScoreCalculated,
  onNextPhase,
  wordCards,
}) => {
  // 점수 계산 로직
  const calculateScore = () => {
    let score = 0;

    for (let i = 0; i < player2DropZones.length; i++) {
      // 각 드랍존에는 한 장의 카드만 있음
      const player1Card = player1GuessZones[i][0];
      const player2Card = player2DropZones[i][0];

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
  }, [player1GuessZones, player2DropZones, onScoreCalculated]);

  const score = calculateScore();

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
        <div className="mt-2 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            {/* 다섯 개의 단어 카드 영역 */}

            <div className="card-container mt-4 flex flex-row space-x-8">
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

            {/* Player 1의 드랍존 카드들 */}
            <div className="mt-3 flex flex-col items-center">
              <h2
                className="mb-3 text-2xl"
                style={{ fontFamily: "DungGeunMo" }}
              >
                Player 2의 선택
              </h2>
              <div className="flex" style={{ gap: "5.5rem" }}>
                {player2DropZones.map((zone, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {zone.map((card) => (
                      <Card2 key={card.id} id={card.id} number={card.number} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Player 2의 예측 카드들 */}
            <div className="mt-3 flex flex-col items-center">
              <h2
                className="mb-3 text-2xl"
                style={{ fontFamily: "DungGeunMo" }}
              >
                Player 1의 예측
              </h2>
              <div className="flex" style={{ gap: "5.5rem" }}>
                {player1GuessZones.map((zone, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {zone.map((card) => (
                      <Card key={card.id} id={card.id} number={card.number} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 점수 표시 */}
          <div className="mt-7 flex flex-col items-center">
            <h3 className="text-3xl" style={{ fontFamily: "DungGeunMo" }}>
              결과 점수
            </h3>
            <div className="mt-2 text-5xl font-bold text-custom-purple-color">
              {score}
            </div>
          </div>

          {/* 다음으로 넘어가는 버튼 */}
          <div className="mt-1">
            <button
              onClick={onNextPhase}
              className="rounded-lg bg-custom-purple-color px-6 py-3 text-2xl text-white"
              style={{ fontFamily: "DungGeunMo" }}
            >
              다음 단계
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;