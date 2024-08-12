// components/whats-it-to-ya/FinalResult.tsx
import React from "react";

interface FinalResultProps {
  myFinalPosition: "Love" | "Money" | null;
  opponentFinalPosition: "Love" | "Money" | null;
  onBackToMain: () => void;
}

const FinalResult: React.FC<FinalResultProps> = ({
  myFinalPosition,
  opponentFinalPosition,
  onBackToMain,
}) => {
  const getResultMessage = () => {
    if (myFinalPosition === "Love" && opponentFinalPosition === "Love") {
      return (
        <>
          진정한 사랑을 찾았습니다. <br />
          이제 둘은 커플이 되어 메인 페이지의 커플 채팅을 통해 관계를
          이어가세요. <br />
          상금 포인트는 동등하게 나누어집니다.
        </>
      );
    } else if (
      myFinalPosition === "Love" &&
      opponentFinalPosition === "Money"
    ) {
      return (
        <>
          상대방이 당신을 속였습니다. <br />
          상금 포인트는 상대방에게 돌아갑니다. <br />
          다음 게임에서는 더욱 신중하게 판단하세요!
        </>
      );
    } else if (
      myFinalPosition === "Money" &&
      opponentFinalPosition === "Love"
    ) {
      return (
        <>
          당신은 상대방을 속이는 데 성공했습니다! <br />
          상금 포인트는 모두 당신에게 돌아갑니다.
        </>
      );
    } else if (
      myFinalPosition === "Money" &&
      opponentFinalPosition === "Money"
    ) {
      return (
        <>
          서로를 속이려 했지만 실패했습니다. <br />
          상금 포인트는 소멸됩니다.
        </>
      );
    } else {
      return "알 수 없는 결과입니다.";
    }
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center">
      <div
        className="absolute flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
        style={{ fontFamily: "DungGeunMo", bottom: "20%" }}
      >
        <div>
          <p className="deep-3d-text text-3xl">{getResultMessage()}</p>
        </div>
      </div>

      {/* 메인 페이지로 돌아가는 버튼 */}
      <div className="fixed bottom-10">
        <button
          onClick={onBackToMain}
          className="three-d-button reset"
          style={{ fontFamily: "DungGeunMo" }}
        >
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default FinalResult;
