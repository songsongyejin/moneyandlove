// components/whats-it-to-ya/FinalResult.tsx
import React, { useEffect } from "react";
import { userToken, userInfo } from "../../atom/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { updateGamePoints } from "../../utils/updateGamePoints";
import { addFriend } from "../../utils/friends";
import { updateRankScore } from "../../utils/rankingAPI";
import { Session } from "openvidu-browser";

interface FinalResultProps {
  myFinalPosition: "Love" | "Money" | null;
  opponentFinalPosition: "Love" | "Money" | null;
  onBackToMain: () => void;
  fromUserId: number;
  toUserId: number;
  leaveSession: () => void;
  session: Session;
  myFirstPosition: string | null;
}

const FinalResult: React.FC<FinalResultProps> = ({
  myFinalPosition,
  opponentFinalPosition,
  onBackToMain,
  fromUserId,
  toUserId,
  leaveSession,
  session,
  myFirstPosition,
}) => {
  const token = useRecoilValue(userToken);
  const setUserInfo = useSetRecoilState(userInfo);
  let gamePoint = 0;

  // 사용자가 "메인 페이지로 돌아가기" 버튼을 클릭할 때, 세션을 떠나기 전에 "정상 종료" 신호를 상대방에게 보냄
  const handleBackToMain = async () => {
    await updatePointsAndAddFriend();

    // "정상 종료" 신호 전송
    session.signal({
      type: "user-leaving",
      data: JSON.stringify({ userId: fromUserId }),
    });

    // 잠시 대기 후 세션 종료
    setTimeout(() => {
      leaveSession();
      onBackToMain();
    }, 1000); // 1초 대기
  };

  console.log("from", fromUserId);
  console.log("to", toUserId);
  const getResultMessage = () => {
    if (myFinalPosition === "Love" && opponentFinalPosition === "Love") {
      gamePoint = 100;
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
      gamePoint = 0;
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
      if (myFirstPosition === "Money") {
        gamePoint = 400; // myFirstPosition이 "Money"인 경우 gamePoint를 400으로 설정
      } else {
        gamePoint = 200; // 기본 gamePoint 값
      }
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
      gamePoint = 0;
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

  const updatePointsAndAddFriend = async () => {
    if (myFinalPosition && opponentFinalPosition && token) {
      try {
        // 게임 포인트 업데이트
        await updateGamePoints({ gamePoint, token });

        // Recoil 상태 업데이트
        setUserInfo((prevUserInfo) => {
          if (prevUserInfo) {
            return {
              ...prevUserInfo,
              gamePoint: prevUserInfo.gamePoint + gamePoint,
            };
          }
          return prevUserInfo;
        });

        console.log(
          `${myFinalPosition} 최종 포지션 선택으로 ${gamePoint} 포인트 변동 성공`
        );

        // 두 사용자가 모두 "Love"를 선택한 경우 친구 추가
        if (myFinalPosition === "Love" && opponentFinalPosition === "Love") {
          await addFriend(token, fromUserId, toUserId);
        }

        // 내가 "Money"를 선택하고 상대방이 "Love"를 선택한 경우 랭킹 포인트 업데이트
        if (myFinalPosition === "Money" && opponentFinalPosition === "Love") {
          await updateRankScore(token, 100); // 예: 100 랭킹 포인트를 추가
          console.log("머니헌터 랭킹 포인트 업데이트 성공");
        }
      } catch (error) {
        console.error("업데이트 또는 친구 추가 실패:", error);
      }
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
          {/* <p className="deep-3d-text mt-4 text-4xl">
            {gamePoint > 0
              ? `+${gamePoint} 포인트 획득!`
              : `${gamePoint} 포인트 차감`}
          </p> */}
        </div>
      </div>

      {/* 메인 페이지로 돌아가는 버튼 */}
      <div className="fixed bottom-10">
        <button
          onClick={handleBackToMain}
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
