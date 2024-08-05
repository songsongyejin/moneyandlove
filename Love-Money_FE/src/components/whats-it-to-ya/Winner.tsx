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
    <div className="flex flex-col items-center justify-center bg-[#F0E9F6]">
      <h1
        className="mb-6 text-4xl font-bold"
        style={{ fontFamily: "DNFBitBitv2" }}
      >
        {resultMessage}
      </h1>
      <div className="mb-6 text-2xl">
        <p>Player 1 Score: {player1Score}</p>
        <p>Player 2 Score: {player2Score}</p>
      </div>
    </div>
  );
};

export default Winner;
