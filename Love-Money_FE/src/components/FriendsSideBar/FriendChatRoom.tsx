import React, { useState } from "react";
import IonIcon from "@reacticons/ionicons";
type friendProfile = { nickName: string; isOnline: boolean; imgUrl: string };

const FriendChatRoom: React.FC<{
  friend: friendProfile;
  onChatClose: () => void;
}> = ({ friend, onChatClose }) => {
  return (
    <div className="bg-chatRoomMain-color absolute bottom-0 left-350px z-20 h-96 w-96 font-semibold opacity-85">
      <header className="flex p-3 text-white">
        <img src={friend.imgUrl} alt="프사" className="h-12" />
        <IonIcon
          name="fitness-outline"
          size="large"
          className={`${friend.isOnline ? "icon" : ""} -ml-4 mr-5`}
        ></IonIcon>
        <h3 className="my-auto">{friend.nickName}</h3>
        <IonIcon
          name="close-outline"
          className="ml-auto cursor-pointer"
          onClick={() => onChatClose()}
          style={{ fontSize: "25px" }}
        ></IonIcon>
      </header>
      <div className="h-1 bg-white"></div>
    </div>
  );
};

export default FriendChatRoom;
