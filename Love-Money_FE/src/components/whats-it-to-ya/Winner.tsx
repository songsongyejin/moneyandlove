import React from "react";

interface WinnerProps {
  player1Score: number;
  player2Score: number;
  userRole: "Player 1" | "Player 2";
}

const Winner: React.FC<WinnerProps> = ({
  player1Score,
  player2Score,
  userRole,
}) => {
  let resultMessage = "";

  if (userRole === "Player 1") {
    if (player1Score > player2Score) {
      resultMessage = "승리하였습니다";
    } else if (player1Score < player2Score) {
      resultMessage = "패배하였습니다";
    } else {
      resultMessage = "무승부입니다";
    }
  } else {
    if (player2Score > player1Score) {
      resultMessage = "승리하였습니다";
    } else if (player2Score < player1Score) {
      resultMessage = "패배하였습니다";
    } else {
      resultMessage = "무승부입니다";
    }
  }

  return (
    <div className="flex h-full animate-fadeIn flex-col items-center justify-center">
      <h1
        className="mb-6 text-center text-6xl text-white"
        style={{ fontFamily: "DNFBitBitv2" }}
      >
        {resultMessage}
      </h1>
      <div className="mt-10 text-4xl text-white">
        <p className="mb-10">당신의 스코어 {player1Score} 점</p>
        <p>상대방의 스코어 {player2Score} 점</p>
      </div>
    </div>
  );
};

export default Winner;
