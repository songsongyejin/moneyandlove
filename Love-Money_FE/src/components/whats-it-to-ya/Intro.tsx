import React from "react";

const Intro: React.FC = () => {
  return (
    <>
      <div className="intro-container flex h-full animate-fadeIn items-center justify-center">
        {/* Intro 메시지 */}
        <div
          className="relative text-center text-white"
          style={{
            fontFamily: "DungGeunMo",
            top: "20%", // 위에서부터 20% 아래에 위치시킴
            transform: "translateY(20%)", // 위치를 아래로 이동
          }}
        >
          <h1 className="deep-3d-text mb-4 text-6xl">
            화상채팅이 시작되었습니다
          </h1>
          <p className="deep-3d-text text-2xl">서로 반갑게 인사해주세요😊</p>
        </div>
      </div>
    </>
  );
};

export default Intro;
