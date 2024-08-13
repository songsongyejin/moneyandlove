import React, { useEffect, useState } from "react";
import "./style.css";
import sampleImage from "../../assets/sample.png"; // 이미지 경로에 맞게 수정
import FreindItem from "./FriendItem";
import FriendChatRoom from "./FriendChatRoom";
import { FiPlusCircle } from "react-icons/fi";
import { userToken } from "../../atom/store";
import { useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { fetchFriendsListData } from "../../utils/friends";
import { CompatClient } from "@stomp/stompjs";
import { connectHandler, subscribeHandler } from "../../utils/Chat";
//받아온 msg 타입
type chatType = {
  roomId: number;
  senderId: number;
  message: string;
  createdAt: string;
};
//친구 목록에 띄울 친구 객체 타입
type friendProfile = {
  followerId: number;
  nickname: string;
  age: number;
  gender: string;
  img: string;
  chatRoomId: number;
};
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
  const [chatData, setChatData] = useState<chatType[]>([]);

  useEffect(() => {
    let isMounted = true;
    const subscriptions: any[] = [];
    let client: CompatClient | null = null;
    if (token && friendsList) {
      const setupConnections = async () => {
        try {
          if (!client) {
            client = await connectHandler(token);
          }
          if (client && isMounted) {
            friendsList.forEach((friend: friendProfile) => {
              const subscription = subscribeHandler(
                client!,
                friend.chatRoomId,
                setChatData
              );
              subscriptions.push(subscription);
            });
          }
        } catch (error) {
          console.error("Failed to setup connections", error);
        }
      };

      setupConnections();
    }

    return () => {
      isMounted = false;
      if (client) {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
        client.disconnect(() => {
          console.log("Disconnected");
        });
      }
    };
  }, [token, friendsList]);

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
          LoveMate
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
          {Array.isArray(friendsList) &&
            friendsList.map((friend: friendProfile, index: number) => {
              return (
                <FreindItem
                  key={index}
                  friend={friend}
                  onChatStart={handleChatStart}
                />
              );
            })}
          <li>
            <FiPlusCircle className="mx-auto mb-4 cursor-pointer text-center text-6xl text-white hover:scale-110" />
          </li>
        </ul>
      </nav>
      {selectedFriend && (
        <FriendChatRoom
          friend={selectedFriend}
          chatData={chatData}
          onChatClose={handleChatClose}
          setChatData={setChatData}
        />
      )}
    </div>
  );
};

export default FreindsSideBar;
