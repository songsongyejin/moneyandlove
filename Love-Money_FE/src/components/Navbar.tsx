import React from "react";
import "../index.css"; // 필요한 CSS 파일 import
import sampleImage from "../assets/sample.png"; // 이미지 경로에 맞게 수정

const Navbar: React.FC = () => {
  return (
    <header className="fixed left-0 top-0 z-50 w-screen">
      <div className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-25"></div>

      <div className="relative flex w-full items-center justify-between px-4 py-4 text-white">
        <h2 className="ml-8" style={{ fontFamily: "DNFBitBitv2" }}>
          Money & Love
        </h2>
        <nav style={{ fontFamily: "DungGeunMo" }} className="flex space-x-10">
          <button className="hover:scale-105">룰북</button>
          <button className="hover:scale-105">랭킹</button>
          <button className="hover:scale-105">출석체크 </button>
          <div className="flex items-center space-x-8">
            <span>돈 1000p</span>
            <img
              src={sampleImage}
              alt="사진"
              className="h-8 w-8 cursor-pointer rounded-full hover:scale-105"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
