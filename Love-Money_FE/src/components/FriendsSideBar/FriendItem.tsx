import React, { useState } from "react";
import "./style.css";
import IonIcon from "@reacticons/ionicons";

type friendProfile = {
  followerId: number;
  nickname: string;
  age: number;
  gender: string;
  img: string;
  chatRoomId: number;
};

const FreindItem: React.FC<{
  friend: friendProfile;
  onChatStart: (friend: friendProfile) => void;
}> = ({ friend, onChatStart }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <li
      className="item mb-10 ml-5 flex cursor-pointer"
      onClick={() => onChatStart(friend)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className={`w-1 rounded drop-shadow-custom ${friend ? "bg-btn-color" : "bg-offline-color"} `}
        ></div>
      )}

      <img src={friend.img} alt="프사" className="ml-5 h-16 rounded-full" />
      <IonIcon
        name="fitness-outline"
        size="large"
        className={`${friend ? "icon" : "offline_icon"} -ml-4 mr-16`}
      ></IonIcon>
      <h3 className="my-auto text-xl">{friend.nickname}</h3>
    </li>
  );
};

export default FreindItem;
