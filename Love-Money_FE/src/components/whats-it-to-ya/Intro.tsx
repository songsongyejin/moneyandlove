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
          <h1
            className="mb-4 text-6xl"
            style={{
              textShadow: `
                1px 1px 2px #000, 2px 2px 4px #000,
                3px 3px 8px rgba(0, 0, 0, 0.7),
                4px 4px 12px rgba(0, 0, 0, 0.7),
                5px 5px 16px rgba(0, 0, 0, 0.7),
                6px 6px 20px rgba(0, 0, 0, 0.7)
              `, // 여러 겹의 그림자를 추가하여 깊이감과 입체감을 만듦
              transform: "perspective(500px) rotateX(15deg)", // 더 강한 원근감을 주기 위해 각도 조정
              fontWeight: "bold",
            }}
          >
            화상채팅이 시작되었습니다
          </h1>
          <p
            className="text-2xl"
            style={{
              textShadow: `
                1px 1px 2px #000, 2px 2px 4px #000,
                3px 3px 8px rgba(0, 0, 0, 0.7),
                4px 4px 12px rgba(0, 0, 0, 0.7),
                5px 5px 16px rgba(0, 0, 0, 0.7),
                6px 6px 20px rgba(0, 0, 0, 0.7)
              `, // 동일한 3D 효과 적용
              transform: "perspective(500px) rotateX(15deg)",
              fontWeight: "bold",
            }}
          >
            서로 반갑게 인사해주세요😊
          </p>
        </div>
      </div>
    </>
  );
};

export default Intro;
