import React, { useState } from "react";
import IonIcon from "@reacticons/ionicons";
import { FiSend } from "react-icons/fi";
import { fetchAllChatData, sendHandler } from "../../utils/Chat";
import { userToken } from "../../atom/store";
import { useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
type friendProfile = {
  followerId: number;
  nickname: string;
  age: number;
  gender: string;
  img: string;
  chatRoomId: number;
};

const FriendChatRoom: React.FC<{
  friend: friendProfile;
  onChatClose: () => void;
}> = ({ friend, onChatClose }) => {
  const token = useRecoilValue(userToken);

  const { data, error, isLoading } = useQuery({
    queryKey: ["chatData", friend.chatRoomId, token],
    queryFn: () => fetchAllChatData(friend.chatRoomId, token as string),
    enabled: !!token,
    staleTime: Infinity,
  });

  const [newMessage, setNewMessage] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (newMessage != "") {
        e.preventDefault();
        sendHandler(token ? token : "", friend.chatRoomId, newMessage);
        setNewMessage(""); // 메시지 전송 후 입력란 비우기
      }
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
          onClick={() => onChatClose()}
          style={{ fontSize: "25px" }}
        ></IonIcon>
      </header>
      <div className="h-1 bg-white"></div>
      <div className="flex-1 overflow-y-auto p-4 text-white">
        {Array.isArray(data) &&
          data.map((chat, index) => (
            <div key={index} className="mb-2">
              <div>{chat.message}</div>
              <div className="text-sm text-gray-400">{chat.senderId}</div>
              <div className="text-xs text-gray-500">
                {new Date(chat.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
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
