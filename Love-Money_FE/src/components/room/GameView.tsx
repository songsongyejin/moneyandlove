import React, { useEffect, useState } from "react";
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
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
  mainStreamManager: StreamManager | undefined;
  subscriber: StreamManager | undefined;
  messages: { user: string; text: string; Emoji: string }[];
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  leaveSession: () => void;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  myUserName: string;
  session: Session;
  matchData: any;
}) => {
  const navigate = useNavigate();
  const token = useRecoilValue(userToken);
  const setUserInfo = useSetRecoilState(userInfo);
  const [firstModal, setFirstModal] = useState(true);
  const [hasLeft, setHasLeft] = useState(false);
  const [isNormalExit, setIsNormalExit] = useState(false);

  // 버튼이 나타날 시간을 관리하는 상태
  const [showNextStepButton, setShowNextStepButton] = useState(false);

  useEffect(() => {
    // 15초 후에 버튼을 보여줌
    const timer = setTimeout(() => {
      setShowNextStepButton(true);
    }, 15000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (session) {
      const handleUserLeaving = (event: any) => {
        const data = JSON.parse(event.data);
        if (data.userId === matchData.toUser.userId) {
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

  const restorePoints = async () => {
    if (token && matchData) {
      try {
        console.log("포인트 복구 중...");
        let gamePoint = 100;

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

        setUserInfo((prevUserInfo: UserInfo | null) => {
          if (prevUserInfo) {
            return {
              ...prevUserInfo,
              gamePoint: prevUserInfo.gamePoint + gamePoint,
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

  const renderChatMode = () => (
    <>
      <ChatBox
        myUserName={myUserName}
        mode={mode}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        matchData={matchData}
      />

      {showNextStepButton && (
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

  const renderFaceChatMode = () => (
    <div className="relative h-full w-full">
      <img
        src={CafeBackground}
        alt="Cafe Background"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center bottom" }}
      />
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
        isOpen={firstModal}
        onClose={() => setFirstModal(false)}
        title={""}
      >
        <p className="mb-4">서로 얼굴을 보기 전, 가볍게 진심을 나눠보세요.</p>
        <p className="mb-4">
          얼굴을 가리면 감정은 더 잘 숨겨지겠지만, 표정리더기가 당신의 얼굴을
          읽어낼 것입니다.
        </p>
        <p className="mb-4">
          만약 상대를 속이고 싶다면, 표정 연기를 더욱 잘해야겠죠?
        </p>
        <p className="mb-4">
          가벼운 이모티콘 채팅이지만, 이 안에 담긴 진심이 중요한 순간입니다.
        </p>
        <p> 자신이 Love 임을 어필해보세요.</p>
      </AgreeFaceChatModal>
      <AgreeFaceChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agree to Face Chat"
        footer={
          <div className="mx-auto mb-2 flex w-1/2 justify-between">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setMode("faceChat");
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
