import React from "react";

const Intro: React.FC = () => {
  return (
    <>
      <div className="intro-container animate-fadeIn flex h-full items-center justify-center">
        {/* Intro 메시지 */}
        <div
          className="text-center text-white"
          style={{
            fontFamily: "DungGeunMo",
          }}
        >
          <h1 className="mb-4 text-6xl">화상채팅이 시작되었습니다</h1>
          <p className="text-2xl">서로 반갑게 인사해주세요😊</p>
        </div>
      </div>
    </>
  );
};

export default Intro;
