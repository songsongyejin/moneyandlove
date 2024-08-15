import React, { useEffect, useRef, useState } from "react";
import UserVideoComponent from "./UserVideoComponent";
import AgreeFaceChatModal from "./AgreeFaceChatModal";
import ChatBox from "./ChatBox";
import { StreamManager, Session } from "openvidu-browser";
import CafeBackground from "../../assets/cafe-background.jpg";
import WhatsItToYa from "./WhatsItToYa";
import { useNavigate } from "react-router-dom";
import { userToken, userInfo, UserInfo } from "../../atom/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { updateGamePoints } from "../../utils/updateGamePoints";

// 게임 뷰 컴포넌트
const GameView = ({
  mode,
  setMode,
  mainStreamManager,
  subscriber,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  leaveSession,
  isModalOpen,
  setIsModalOpen,
  myUserName,
  session,
  matchData,
}: {
  mode: string; // 모드 상태 변수 (채팅 또는 화상 채팅)
  setMode: React.Dispatch<React.SetStateAction<string>>; // 모드 변경 핸들러
  mainStreamManager: StreamManager | undefined; // 메인 스트림 관리자
  subscriber: StreamManager | undefined; // 구독자 스트림 관리자
  messages: { user: string; text: string; Emoji: string }[]; // 메시지 상태 변수
  newMessage: string; // 새 메시지 상태 변수
  setNewMessage: React.Dispatch<React.SetStateAction<string>>; // 새 메시지 변경 핸들러
  sendMessage: () => void; // 메시지 전송 함수
  leaveSession: () => void; // 세션 떠나기 함수
  isModalOpen: boolean; // 모달 상태 변수
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>; // 모달 상태 변경 핸들러
  myUserName: string;
  session: Session; // 추가: OpenVidu 세션 객체
  matchData: any;
}) => {
  const navigate = useNavigate();
  const token = useRecoilValue(userToken);
  const setUserInfo = useSetRecoilState(userInfo);

  // 포인트 복구 함수
  const restorePoints = async () => {
    if (token && matchData) {
      try {
        console.log("포인트 복구 중...");
        // 복구할 포인트 결정 (deductPoints에서 차감한 포인트와 동일한 값을 사용)
        let gamePoint = 100; // 기본 복구 포인트

        switch (matchData.fromUser.matchingMode) {
          case "random":
            gamePoint = 100;
            break;
          case "love":
            gamePoint = 500;
            break;
          case "top30":
            gamePoint = 1000;
            break;
          default:
            console.warn(
              "알 수 없는 매칭 모드:",
              matchData.fromUser.matchingMode
            );
        }

        await updateGamePoints({ gamePoint, token });

        // Recoil 상태 업데이트
        setUserInfo((prevUserInfo: UserInfo | null) => {
          if (prevUserInfo) {
            return {
              ...prevUserInfo,
              gamePoint: prevUserInfo.gamePoint + gamePoint, // 포인트 복구
            };
          }
          return prevUserInfo;
        });

        console.log(`${gamePoint} 포인트 복구 완료`);
      } catch (error) {
        console.error("포인트 복구 실패", error);
      }
    }
  };

  const [hasLeft, setHasLeft] = useState(false);
  const [isNormalExit, setIsNormalExit] = useState(false);

  useEffect(() => {
    if (session) {
      const handleConnectionDestroyed = () => {
        if (!hasLeft && session.remoteConnections.size === 0 && !isNormalExit) {
          setHasLeft(true);
          alert("상대방이 나갔습니다. 소모한 포인트는 다시 회수됩니다.");
          handleOpponentLeft();
        }
      };

      session.on("connectionDestroyed", handleConnectionDestroyed);

      return () => {
        session.off("connectionDestroyed", handleConnectionDestroyed);
      };
    }
  }, [session, hasLeft]);

  // 상대방이 보낸 "정상 종료" 신호를 받았을 때 처리하는 로직
  useEffect(() => {
    if (session) {
      const handleUserLeaving = (event: any) => {
        const data = JSON.parse(event.data);
        if (data.userId === matchData.toUser.userId) {
          // 상대방이 정상적으로 나가는 경우
          console.log("상대방이 정상적으로 세션을 종료했습니다.");
          setIsNormalExit(true);
          setHasLeft(true);
        }
      };

      session.on("signal:user-leaving", handleUserLeaving);

      return () => {
        session.off("signal:user-leaving", handleUserLeaving);
      };
    }
  }, [session, matchData]);

  const handleOpponentLeft = async () => {
    await restorePoints();
    leaveSession();
    navigate("/main");
  };

  const renderChatMode = () => (
    <>
      {/* 채팅 모드일 때의 UI */}
      <ChatBox
        myUserName={myUserName}
        mode={mode}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        matchData={matchData}
      />
      <button
        onClick={() => setIsModalOpen(true)}
        className="z-50 rounded text-white"
      >
        Open Face Chat Agreement
      </button>
    </>
  );

  {
    /* 화상 채팅 모드일 때의 UI */
  }
  const renderFaceChatMode = () => (
    // <div
    //   className="absolute inset-0 bg-cover"
    //   style={{
    //     backgroundImage: `url(${CafeBackground})`,
    //     backgroundPosition: "center bottom",
    //   }}
    // >
    <div className="relative h-full w-full">
      {/* 배경 이미지 */}
      {/* 빠른 배경 이미지 렌더링 위해 img 태그 사용 */}
      <img
        src={CafeBackground}
        alt="Cafe Background"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center bottom" }}
      />
      {/* 본인 캠화면 (왼쪽하단에 위치) */}
      {mainStreamManager && (
        <div
          id="main-video"
          className="absolute bottom-4 left-2 w-64 rounded-2xl p-2 shadow-lg"
          style={{
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        >
          <UserVideoComponent streamManager={mainStreamManager} />
        </div>
      )}
      {/* 상대방 캠화면 (가운데 상단에 위치) */}
      {subscriber && (
        <div
          id="video-container"
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 transform"
        >
          <div
            style={{
              width: "29vw",
              height: "18vw",
              clipPath:
                "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            }}
          >
            <UserVideoComponent streamManager={subscriber} />
          </div>
        </div>
      )}

      {/* WhatsItToYa 게임 화면 */}
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <WhatsItToYa
          session={session}
          matchData={matchData}
          leaveSession={leaveSession}
        />
      </div>
    </div>
  );

  return (
    <div
      id="session"
      className={`flex h-screen ${
        mode === "chat" ? "justify-end" : "justify-center"
      }`}
    >
      {mode === "chat" ? renderChatMode() : renderFaceChatMode()}

      <AgreeFaceChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agree to Face Chat"
        footer={
          <div className="mx-auto flex w-1/2 justify-between">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setMode("faceChat");
              }}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
            >
              진행
            </button>
            <button
              onClick={leaveSession}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
            >
              거부
            </button>
          </div>
        }
      >
        <p>상대방과 화상채팅을 진행하시겠습니까?</p>
      </AgreeFaceChatModal>
    </div>
  );
};

export default GameView;
