import React, { useEffect, useRef, useState } from "react";
import IonIcon from "@reacticons/ionicons";
import { FiSend } from "react-icons/fi";
import { fetchAllChatData, sendHandler, unSUbscribe } from "../../utils/Chat";
import { userToken } from "../../atom/store";
import { useRecoilValue } from "recoil";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type friendProfile = {
  followerId: number;
  nickname: string;
  age: number;
  gender: string;
  img: string;
  chatRoomId: number;
};

type chatType = {
  roomId: number;
  senderId: number;
  message: string;
  createdAt: string;
};

const FriendChatRoom: React.FC<{
  friend: friendProfile;
  onChatClose: () => void;
  chatData: chatType[];
  setChatData: React.Dispatch<React.SetStateAction<chatType[]>>;
}> = ({ friend, onChatClose, chatData, setChatData }) => {
  const token = useRecoilValue(userToken);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const queryClient = useQueryClient();
  useEffect(() => {
    // Invalidate and refetch when friend changes
    queryClient.invalidateQueries(["chatData", friend.chatRoomId, token]);
  }, [friend, queryClient]);
  useEffect(() => {
    scrollToBottom();
  }, [chatData]);
  const {
    data: initialData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["chatData", friend.chatRoomId, token],
    queryFn: () => fetchAllChatData(friend.chatRoomId, token as string),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (initialData) {
      setChatData(initialData);
    }
  }, [initialData]);

  const [newMessage, setNewMessage] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newMessage.trim() !== "") {
      e.preventDefault();
      sendHandler(token || "", friend.chatRoomId, newMessage);
      setNewMessage(""); // 메시지 전송 후 입력란 비우기
    }
  };

  return (
    <div className="absolute bottom-0 left-350px z-20 flex h-96 w-96 flex-col bg-chatRoomMain-color font-semibold opacity-85">
      <header className="flex p-3 text-white">
        <img src={friend.img} alt="프사" className="h-12 rounded-full" />
        <IonIcon
          name="fitness-outline"
          size="large"
          className={`${friend ? "icon" : ""} -ml-4 mr-5`}
        ></IonIcon>
        <h3 className="my-auto">{friend.nickname}</h3>
        <IonIcon
          name="close-outline"
          className="ml-auto cursor-pointer"
          onClick={onChatClose}
          style={{ fontSize: "25px" }}
        ></IonIcon>
      </header>
      <div className="h-1 bg-white"></div>
      <div className="flex-1 flex-col-reverse overflow-y-auto p-4 text-white">
        {Array.isArray(chatData) &&
          chatData.map((chat, index) => (
            <div
              key={index}
              className={`mb-2 rounded-lg p-2 ${
                chat.senderId === friend.followerId
                  ? "text-left text-custom-purple-color"
                  : "ml-auto text-right"
              }`}
            >
              <div>{chat.message}</div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        type="text"
        className="w-full border-t-2 border-solid border-custom-purple-color bg-chatRoomMain-color p-4 text-white focus:outline-none"
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}
        placeholder="메시지를 입력하세요"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default FriendChatRoom;
