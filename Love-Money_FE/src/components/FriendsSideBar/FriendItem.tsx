import React, { useState } from "react";
import "./style.css";
import IonIcon from "@reacticons/ionicons";

type friendProfile = { nickName: string; isOnline: boolean; imgUrl: string };

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
          className={`drop-shadow-custom w-1 rounded ${friend.isOnline ? "bg-online-color" : "bg-offline-color"} `}
        ></div>
      )}

      <img src={friend.imgUrl} alt="프사" className="ml-5 h-16" />
      <IonIcon
        name="fitness-outline"
        size="large"
        className={`${friend.isOnline ? "icon" : "offline_icon"} -ml-4 mr-16`}
      ></IonIcon>
      <h3 className="my-auto text-xl">{friend.nickName}</h3>
    </li>
  );
};

export default FreindItem;
