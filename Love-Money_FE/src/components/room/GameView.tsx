import React from "react";
import UserVideoComponent from "./UserVideoComponent";
import AgreeFaceChatModal from "./AgreeFaceChatModal";
import ChatBox from "./ChatBox";
import { StreamManager } from "openvidu-browser";

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
  myUserName: String;
}) => {
  return (
    <div
      id="session"
      className={`${mode === "chat" ? "justify-end" : "justify-center"} flex h-screen p-4`}
    >
      {mainStreamManager && (
        <div
          id="main-video"
          className={`${mode === "chat" ? "collapse" : ""} absolute left-2 top-4 w-72 rounded-2xl bg-white p-4`}
        >
          <UserVideoComponent streamManager={mainStreamManager} />
        </div>
      )}
      <div
        className={`${mode === "chat" ? "hidden" : ""} flex w-3/5 items-center justify-center bg-violet-400`}
      >
        <div>게임이 들어갈 화면입니다.</div>
      </div>
      <div
        id="video-container"
        className={`${mode === "chat" ? "hidden" : ""}`}
      >
        {subscriber && (
          <div className="stream-container absolute bottom-4 right-2 w-72 rounded-2xl bg-white p-4">
            <UserVideoComponent streamManager={subscriber} />
          </div>
        )}
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${mode === "chat" ? "" : "hidden"} rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700`}
      >
        Open Face Chat Agreement
      </button>

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
      <ChatBox
        myUserName={myUserName}
        mode={mode}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default GameView;
