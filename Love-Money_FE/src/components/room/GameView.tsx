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
import coffee from "../../assets/coffee.png";
import { useAudio } from "../../hooks/useAudio"; // Import the useAudio hook

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

  const { play, pause } = useAudio("/path/to/your/music.mp3");
  const prevMode = useRef(mode); // 이전 모드를 추적하기 위해 useRef 사용
  const [isReady, setIsReady] = useState(false); // 현재 사용자의 준비 상태
  const [opponentReady, setOpponentReady] = useState(false); // 상대방의 준비 상태
  const [waitingForOpponent, setWaitingForOpponent] = useState(false); // 상대방 기다리는 중 상태

  useEffect(() => {
    if (prevMode.current !== mode) {
      // 모드가 변경되었을 때만 실행
      if (mode === "chat") {
        play();
      } else if (mode === "faceChat") {
        pause();
      }
      prevMode.current = mode; // 이전 모드를 현재 모드로 업데이트
    }
  }, [mode, play, pause]);

  // 상대방의 준비 상태를 수신
  useEffect(() => {
    if (session) {
      const handleOpponentReady = (event: any) => {
        const data = JSON.parse(event.data);
        const senderConnectionId = event.from.connectionId; // 신호를 보낸 사람의 connectionId

        // 디버깅용 로그 추가
        console.log("내 connectionId:", session.connection.connectionId);
        console.log("신호를 보낸 connectionId:", senderConnectionId);

        // 본인이 보낸 신호는 무시하고, 상대방이 보낸 신호만 처리
        if (senderConnectionId !== session.connection.connectionId) {
          console.log("상대방이 준비 완료");
          setOpponentReady(true);
        } else {
          console.log("자신이 보낸 신호를 무시합니다.");
        }
      };

      session.on("signal:ready", handleOpponentReady);

      return () => {
        session.off("signal:ready", handleOpponentReady);
      };
    }
  }, [session]);

  // 본인과 상대방 모두 준비된 경우 faceChat 모드로 전환
  useEffect(() => {
    if (isReady && opponentReady) {
      console.log(
        "두 사용자가 모두 준비되었습니다. 모드를 faceChat으로 전환합니다."
      );
      setMode("faceChat");
    }
  }, [isReady, opponentReady, setMode]);

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
  // 타이머 관련 상태
  const [showNextStepButton, setShowNextStepButton] = useState(false);

  useEffect(() => {
    // 15초 후에 버튼을 보여줌
    const timer = setTimeout(() => {
      setShowNextStepButton(true);
    }, 15000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, []);

  // "만나러가기" 버튼 클릭 시 호출되는 함수
  const handleReady = () => {
    console.log("사용자가 '만나러가기' 버튼을 눌렀습니다."); // 클릭 로그
    setWaitingForOpponent(true); // 상대방 기다리는 중 상태로 설정
    setIsReady(true); // 현재 사용자를 준비 상태로 설정

    // 상대방에게 준비 상태를 알림
    session.signal({
      type: "ready",
      data: JSON.stringify({ ready: true }),
    });
  };

  useEffect(() => {
    if (session) {
      const handleConnectionDestroyed = () => {
        if (!hasLeft && session.remoteConnections.size === 0 && !isNormalExit) {
          setHasLeft(true);
          alert(
            "상대방의 연결이 끊어졌습니다. 사용하신 포인트는 원상태로 복원됩니다."
          );
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

      {!waitingForOpponent &&
        showNextStepButton && ( // 상대방 기다리는 중일 때 버튼 숨기기
          <button
            onClick={() => setIsModalOpen(true)}
            className="shake-left absolute top-1/2 z-50 mr-10 flex items-center rounded bg-transparent p-4 text-2xl font-bold text-white hover:scale-110"
            style={{ fontFamily: "DungGeunMo" }}
          >
            <img src={coffee} alt="" className="w-16" />
            <p>다음 단계로 넘어가기!</p>
          </button>
        )}
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

      {waitingForOpponent && !opponentReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p
            className="text-4xl text-white"
            style={{ fontFamily: "DungGeunMo" }}
          >
            상대방 기다리는중...
          </p>
        </div>
      )}

      <AgreeFaceChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agree to Face Chat"
        footer={
          <div className="mx-auto mb-2 flex w-1/2 justify-between">
            <button
              onClick={() => {
                setIsModalOpen(false);
                handleReady(); // "만나러가기" 버튼 클릭 시 ready 상태로 전환
              }}
              className="rounded bg-transparent px-4 py-2 text-white hover:bg-black"
            >
              만나러가기
            </button>
            <button
              onClick={() => {
                leaveSession();
                navigate("/main");
              }}
              className="rounded bg-transparent px-4 py-2 text-white hover:bg-black"
            >
              도망가기
            </button>
          </div>
        }
      >
        <p className="mb-4">
          어느덧 꽤 시간이 흘렀고, 이제 우리는 다음 단계로 나아갈 준비가
          되었습니다.
        </p>
        <p className="mb-4">
          이제는 가상에서 현실로, 이모티콘에서 실제로, 서로를 마주할 시간입니다.
        </p>
        <p>*진행시 화상 캠이 연결됩니다*</p>
      </AgreeFaceChatModal>
    </div>
  );
};

export default GameView;
