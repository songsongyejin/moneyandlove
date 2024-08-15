import React, { useState, useEffect } from "react";
import { userInfo, userToken } from "../../atom/store";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import kakaoLogoutImage from "../../assets/kakao_logout.svg";
import { deleteUserData } from "../../utils/user";
import BaseModal from "./BaseModal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useRecoilState(userInfo);
  const [token, setToken] = useRecoilState(userToken);
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     // Recoil 상태 초기화
  //     setUser(null);
  //     setToken(null);

  //     // 모달 닫기
  //     onClose();

  //     // 홈 페이지로 이동
  //     navigate("/");
  //   } catch (error) {
  //     console.error("로그아웃 처리 중 오류가 발생했습니다:", error);
  //   }
  // };
  const clearCookies = () => {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
    }
  };

  const handleLogout = () => {
    console.log(userInfo);
    console.log(userToken);
    // Recoil 상태 초기화
    setUser(null);
    setToken(null);

    // LocalStorage 및 SessionStorage 초기화
    localStorage.removeItem("recoil-persist");
    sessionStorage.clear();

    // 모든 쿠키 삭제
    clearCookies();

    // 강제 리다이렉트
    window.location.href = "/"; // 로그인 페이지로 리디렉트
  };

  const handleDeleteAccount = () => {
    // 여기에 회원탈퇴 로직을 구현합니다.
    // 예: API 호출 등
    if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      deleteUserData(token as string);
      setUser(null); // 사용자 정보 초기화
      onClose(); // 모달 닫기
      navigate("/"); // 홈 페이지로 이동
    }
  };

  const renderContent = () => (
    <div
      className="flex flex-col items-center text-lg"
      style={{ fontFamily: "DungGeunMo" }}
    >
      <img
        src={user?.profileURL}
        alt="프로필"
        className="mb-4 h-32 w-32 rounded-full"
      />
      <p className="mb-2">닉네임: {user?.nickname}</p>
      <p className="mb-2">나이: {user?.age}</p>
      <p className="mb-2">성별: {user?.gender}</p>
      <p>포인트: {user?.gamePoint}</p>
      <div className="mt-10 flex justify-center space-x-12">
        <button
          onClick={handleLogout}
          className="w-52 rounded-lg hover:scale-105 hover:brightness-95 active:brightness-100"
        >
          <img
            src={kakaoLogoutImage}
            alt="카카오 로그아웃"
            className="h-auto w-full"
          />
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-48 rounded-lg bg-custom-purple-color py-1 text-base text-white transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-95 active:brightness-100"
          style={{
            fontFamily: "DNFBitBitv2",
          }}
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="내 프로필">
      {renderContent()}
    </BaseModal>
  );
};

export default ProfileModal;
