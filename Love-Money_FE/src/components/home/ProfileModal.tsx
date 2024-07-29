import React, { useState } from "react";
import { userInfo } from "../../atom/store";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import kakaoLogoutImage from "../../assets/kakao_logout.svg";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useRecoilState(userInfo);
  const [activeTab, setActiveTab] = useState<"info" | "record">("info");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    setUser(null); // 사용자 정보 초기화
    onClose(); // 모달 닫기
    navigate("/"); // 홈 페이지로 이동
  };

  const handleDeleteAccount = () => {
    // 여기에 회원탈퇴 로직을 구현합니다.
    // 예: API 호출 등
    if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      setUser(null); // 사용자 정보 초기화
      onClose(); // 모달 닫기
      navigate("/"); // 홈 페이지로 이동
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex h-[500px] w-[750px] flex-col overflow-hidden rounded-[20px] bg-[#8B6CAC]">
        {/* 상단바 */}
        <div className="relative flex w-full items-end justify-between pb-0 pl-10 pr-2 pt-2">
          {/* 탭 */}
          <div className="flex h-12 text-lg">
            <button
              className={`px-12 py-1 ${
                activeTab === "info"
                  ? "rounded-t-[15px] bg-[#F0E9F6] font-bold text-[#000000] text-opacity-80"
                  : "rounded-t-[15px] bg-[#7B5E9C] bg-opacity-70 text-[#000000] text-opacity-80"
              } transition-colors`}
              style={{ fontFamily: "DNFBitBitv2" }}
              onClick={() => setActiveTab("info")}
            >
              내 프로필
            </button>
            <button
              className={`ml-3 px-14 py-1 ${
                activeTab === "record"
                  ? "rounded-t-[15px] bg-[#F0E9F6] font-bold text-[#000000] text-opacity-80"
                  : "rounded-t-[15px] bg-[#7B5E9C] bg-opacity-70 text-[#000000] text-opacity-80"
              } transition-colors`}
              style={{ fontFamily: "DNFBitBitv2" }}
              onClick={() => setActiveTab("record")}
            >
              내 전적
            </button>
          </div>
          {/* 닫기 버튼 */}
          <button className="mb-3 text-white" onClick={onClose}>
            <IoClose size={32} />
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 bg-[#8B6CAC] px-3 pb-3">
          <div className="h-full overflow-y-auto rounded-[10px] bg-[#F0E9F6] p-6">
            {activeTab === "info" && (
              <div
                className="flex flex-col items-center"
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
                <p>포인트: {user?.points}</p>
                <div className="mt-16 flex justify-center space-x-12">
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
            )}{" "}
            {activeTab === "record" && <p>여기에 전적 정보를 표시합니다.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
