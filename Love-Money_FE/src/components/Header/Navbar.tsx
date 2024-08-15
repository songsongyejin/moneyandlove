import React, { useState } from "react";
import "../../index.css"; // 필요한 CSS 파일 import
import { userInfo } from "../../atom/store";
import { useRecoilState } from "recoil";

import sampleImage from "../../assets/sample.png"; // 이미지 경로에 맞게 수정
import RulebookModal from "../home/RulebookModal";
import RankingModal from "..//home/RankingModal";
import AttendanceModal from "../home/AttendanceModal";
import ProfileModal from "../home/ProfileModal";
import FaceVerification from "../game/FaceVerification";
import { LiaCoinsSolid } from "react-icons/lia";
import { FaPlusCircle, FaCoins } from "react-icons/fa";
import { useAudio } from "../../hooks/useAudio"; // Import the useAudio hook

const Navbar: React.FC = () => {
  const [user, setUser] = useRecoilState(userInfo);
  const [modals, setModals] = useState({
    rulebook: false,
    ranking: false,
    attendance: false,
    profile: false,
    face: false,
  });

  const { play, pause, setVolume, volume } = useAudio("/path/to/your/audio.mp3"); // Use the useAudio hook

  const openModal = (modal: string) => setModals({ ...modals, [modal]: true });
  const closeModal = (modal: string) =>
    setModals({ ...modals, [modal]: false });

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-10 block w-screen">
        <div className="absolute left-0 top-0 h-full w-full bg-black"></div>

        <div className="relative flex w-full items-center justify-between px-4 py-4 text-white">
          <h2 className="ml-8 text-2xl" style={{ fontFamily: "DNFBitBitv2" }}>
            Money & Love
          </h2>
          <nav style={{ fontFamily: "DungGeunMo" }} className="flex space-x-10">
            <button
              className="hover:scale-105"
              onClick={() => openModal("rulebook")}
            >
              게임소개
            </button>
            <button
              className="hover:scale-105"
              onClick={() => openModal("face")}
            >
              얼굴
            </button>
            <button
              className="hover:scale-105"
              onClick={() => openModal("ranking")}
            >
              랭킹
            </button>
            <button
              className="flex flex-row items-center hover:scale-105"
              onClick={() => openModal("attendance")}
            >
              <span>출석체크</span>
              <div
                style={{ fontSize: "15px" }}
                className="ml-2 flex items-center space-x-1"
              >
                <FaPlusCircle className="text-custom-purple-color" />
                <FaCoins className="text-custom-purple-color" />
              </div>
            </button>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-1">
                <LiaCoinsSolid style={{ fontSize: "36px" }} />{" "}
                {/* 색상을 원하면 여기에 추가 */}
                <span className="text-lg">{user?.gamePoint || 0}</span>
              </div>
              <img
                src={user?.profileURL || sampleImage}
                alt="사진"
                className="h-8 w-8 cursor-pointer rounded-full hover:scale-105"
                onClick={() => openModal("profile")}
              />
            </div>
            {/* Volume Control Slider */}
            <div className="flex items-center space-x-2">
              <label htmlFor="volume-slider" className="text-sm">
                Volume:
              </label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </nav>
        </div>
      </header>
      <RulebookModal
        isOpen={modals.rulebook}
        onClose={() => closeModal("rulebook")}
      />
      <RankingModal
        isOpen={modals.ranking}
        onClose={() => closeModal("ranking")}
      />
      <AttendanceModal
        isOpen={modals.attendance}
        onClose={() => closeModal("attendance")}
      />
      <ProfileModal
        isOpen={modals.profile}
        onClose={() => closeModal("profile")}
      />
      <FaceVerification
        isOpen={modals.face}
        onClose={() => closeModal("face")}
      />
    </>
  );
};

export default Navbar;
