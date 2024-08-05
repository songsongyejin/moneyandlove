import React, { useState } from "react";
import "./style.css";
import sampleImage from "../../assets/sample.png"; // 이미지 경로에 맞게 수정
import FreindItem from "./FriendItem";
import FriendChatRoom from "./FriendChatRoom";
import { FiPlusCircle } from "react-icons/fi";
import { userToken } from "../../atom/store";
import { useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { fetchFriendsListData } from "../../utils/friends";
const FreindsSideBar: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<friendProfile | null>(
    null
  );
  const token = useRecoilValue(userToken);
  const {
    data: friendsList,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["friendsList", token],
    queryFn: () => fetchFriendsListData(token as string),
    enabled: !!token,
  });
  console.log(friendsList);
  //친구 목록에 띄울 친구 객체 타입
  type friendProfile = {
    folloserId: number;
    nickname: string;
    age: number;
    gender: string;
    img: string;
  };

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
    <div style={{ fontFamily: "DungGeunMo" }}>
      <nav
        className={`fNav z-50 overflow-hidden ${navOpen ? "nav-open overflow-y-scroll" : ""}`}
      >
        <h1 className={`as mt-5 w-full text-center text-3xl text-white`}>
          친구목록
        </h1>
        <div className="menu-btn w-8" onClick={handleMenuClick}>
          <div className={`line line--1 ${navOpen ? "line-cross" : ""}`}></div>
          <div
            className={`line line--2 ${navOpen ? "line-fade-out" : ""}`}
          ></div>
          <div className={`line line--3 ${navOpen ? "line-cross" : ""}`}></div>
        </div>

        <ul
          className={`nav-links ${navOpen ? "fade-in" : ""} font-bold text-white`}
        >
          {friendsList &&
            friendsList.map((friend: friendProfile, index: number) => (
              <FreindItem
                key={index}
                friend={friend}
                onChatStart={handleChatStart}
              />
            ))}
          <li>
            <FiPlusCircle className="mx-auto mb-4 cursor-pointer text-center text-6xl text-white hover:scale-110" />
          </li>
        </ul>
      </nav>
      {selectedFriend && (
        <FriendChatRoom friend={selectedFriend} onChatClose={handleChatClose} />
      )}
    </div>
  );
};

export default FreindsSideBar;
