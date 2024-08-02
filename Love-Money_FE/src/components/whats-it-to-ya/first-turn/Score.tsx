import React from "react";
// FirstTurnScore

interface CardType {
  id: string;
  number: number;
}

interface ScoreProps {
  player1DropZones: CardType[][];
  player2GuessZones: CardType[][];
}

const Score: React.FC<ScoreProps> = ({
  player1DropZones,
  player2GuessZones,
}) => {
  // 점수 계산 로직
  const calculateScore = () => {
    let score = 0;

    for (let i = 0; i < player1DropZones.length; i++) {
      const player1Card = player1DropZones[i][0]; // 각 드랍존에는 한 장의 카드만 있음
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

  const score = calculateScore();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-3xl" style={{ fontFamily: "DungGeunMo" }}>
          첫 번째 턴 점수
        </h1>
        <p className="text-xl">
          Player 1의 우선순위와 Player 2의 예측 비교 결과:
        </p>
        <div className="mt-4 text-2xl">
          <span>점수: </span>
          <span className="font-bold">{score}</span>
        </div>
      </div>
    </div>
  );
};

export default Score;
