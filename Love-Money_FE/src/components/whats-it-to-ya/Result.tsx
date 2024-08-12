import React from "react";

interface ResultProps {
  winner: string | null;
  loser: string | null;
  userRole: "Player 1" | "Player 2";
  onNextPhase: () => void;
}

const Result: React.FC<ResultProps> = ({
  winner,
  loser,
  userRole,
  onNextPhase,
}) => {
  let resultMessage = "";

  if (userRole === winner) {
    resultMessage = "승리하였습니다";
  } else if (userRole === loser) {
    resultMessage = "패배하였습니다";
  } else {
    resultMessage = "무승부입니다";
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-between">
      {/* 설명 영역 */}
      <div
        className="absolute flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
        style={{
          fontFamily: "DungGeunMo",
          top: "70%", // 텍스트 위치를 적절히 조정
        }}
      >
        <div>
          <p className="deep-3d-text mb-3 text-7xl">{resultMessage}</p>
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

export default Result;
