import React, { useState } from "react";
import IonIcon from "@reacticons/ionicons";
import { FiSend } from "react-icons/fi";
import { sendHandler } from "../../utils/Chat";
import { userToken } from "../../atom/store";
import { useRecoilValue } from "recoil";
type friendProfile = {
  folloserId: number;
  nickname: string;
  age: number;
  gender: string;
  img: string;
};

const FriendChatRoom: React.FC<{
  friend: friendProfile;
  onChatClose: () => void;
}> = ({ friend, onChatClose }) => {
  const token = useRecoilValue(userToken);

  const [newMessage, setNewMessage] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendHandler(token ? token : "", 1, newMessage);
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
          onClick={() => onChatClose()}
          style={{ fontSize: "25px" }}
        ></IonIcon>
      </header>
      <div className="h-1 bg-white"></div>
      <div className="flex-1 overflow-y-auto p-4 text-white">내용</div>

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
