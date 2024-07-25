import React, { useState } from "react";
import "./style.css";
import sampleImage from "../../assets/sample.png"; // 이미지 경로에 맞게 수정
import FreindItem from "./FriendItem";
import FriendChatRoom from "./FriendChatRoom";

const FreindsSideBar: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<friendProfile | null>(
    null
  );
  //친구 목록에 띄울 친구 객체 타입
  type friendProfile = { nickName: string; isOnline: boolean; imgUrl: string };

  //친구 mock data
  const friendsMock: friendProfile[] = [
    { nickName: "짱지환", isOnline: true, imgUrl: sampleImage },
    { nickName: "갓지환", isOnline: false, imgUrl: sampleImage },
    { nickName: "황지환", isOnline: false, imgUrl: sampleImage },
    { nickName: "뉴지환", isOnline: true, imgUrl: sampleImage },
    { nickName: "네오지환", isOnline: true, imgUrl: sampleImage },
    { nickName: "빅지환", isOnline: true, imgUrl: sampleImage },
    { nickName: "대지환", isOnline: true, imgUrl: sampleImage },
    { nickName: "신지환", isOnline: true, imgUrl: sampleImage },
    { nickName: "대황지환", isOnline: true, imgUrl: sampleImage },
    { nickName: "상지환", isOnline: true, imgUrl: sampleImage },
  ];

  const handleMenuClick = () => {
    setNavOpen(!navOpen);
  };

  const handleChatStart = (friend: friendProfile) => {
    setSelectedFriend(friend);
  };

  const handleChatClose = () => {
    setSelectedFriend(null);
  };
  return (
    <div className="z-20" style={{ fontFamily: "DungGeunMo" }}>
      <nav className={`fNav ${navOpen ? "nav-open" : ""}`}>
        <div className="menu-btn w-8" onClick={handleMenuClick}>
          <div className={`line line--1 ${navOpen ? "line-cross" : ""}`}></div>
          <div
            className={`line line--2 ${navOpen ? "line-fade-out" : ""}`}
          ></div>
          <div className={`line line--3 ${navOpen ? "line-cross" : ""}`}></div>
        </div>

        <ul
          className={`nav-links ${navOpen ? "fade-in" : ""} overflow-y-scroll font-bold text-white`}
        >
          {friendsMock &&
            friendsMock.map((friend, index) => (
              <FreindItem
                key={index}
                friend={friend}
                onChatStart={handleChatStart}
              />
            ))}
        </ul>
      </nav>
      {selectedFriend && (
        <FriendChatRoom friend={selectedFriend} onChatClose={handleChatClose} />
      )}
    </div>
  );
};

export default FreindsSideBar;
