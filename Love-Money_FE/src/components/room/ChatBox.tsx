import { StreamManager } from "openvidu-browser";
import React from "react";
import { FiSend } from "react-icons/fi";
import chatBot from "../../assets/chatBot.png";

// 채팅 박스 컴포넌트
const ChatBox = ({
  mode,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  myUserName,
}: {
  mode: string; // 모드 상태 변수 (채팅 또는 화상 채팅)
  messages: { user: string; text: string; Emoji: string }[]; // 메시지 상태 변수
  newMessage: string; // 새 메시지 상태 변수
  setNewMessage: React.Dispatch<React.SetStateAction<string>>; // 새 메시지 변경 핸들러
  sendMessage: () => void; // 메시지 전송 함수
  myUserName: string; // 현재 사용자 이름
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      style={{ fontFamily: "DungGeunMo" }}
      className={`${mode === "chat" ? "" : "hidden"} w-96 flex-col rounded-2xl`}
    >
      <img src={chatBot} alt="" className="absolute bottom-5 left-5 w-16" />
      <div className="absolute bottom-20 left-24 rounded-e-2xl rounded-tl-2xl border-4 border-solid border-custom-purple-color bg-white p-3 text-lg font-semibold text-custom-purple-color">
        자신이 러브헌터임을 어필해주세요!
      </div>
      <header className="bg-chatRoom-high h-14 rounded-t-2xl bg-custom-purple-color"></header>
      <div className="h-5/6 overflow-y-auto border border-gray-300 bg-chatRoom-color p-2">
        {messages.map((msg, i) => {
          const isMyMessage = msg.user === myUserName;
          return (
            <div
              key={i}
              className={`mb-1 flex ${isMyMessage ? "justify-end" : "justify-start"}`}
            >
              {isMyMessage ? (
                <>
                  <div
                    className={`max-w-xs rounded-lg p-2 ${isMyMessage ? "bg-gray-200 text-black" : "bg-chat-color text-black"}`}
                  >
                    {msg.text}
                  </div>
                  <p className="my-auto text-2xl">{msg.Emoji}</p>
                </>
              ) : (
                <>
                  <p className="my-auto text-2xl">{msg.Emoji}</p>
                  <div
                    className={`max-w-xs rounded-lg p-2 ${isMyMessage ? "bg-gray-200 text-black" : "bg-chat-color text-black"}`}
                  >
                    <strong>{msg.user}:</strong> {msg.text}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="bg-chat-color flex items-center rounded-b-2xl p-4">
        <input
          type="text"
          className="flex-grow rounded-s-lg p-2 focus:outline-custom-purple-color"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
        />
        <div className="rounded-e-lg bg-custom-purple-color p-2 px-4">
          <FiSend
            className="cursor-pointer text-2xl text-white"
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
