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
          <p className="deep-3d-text mb-4 text-3xl">
            당신은 조용한 카페에 앉아 있습니다.
          </p>
          <p className="deep-3d-text mb-4 text-3xl">
            바로 앞에는 그동안 이모티콘으로만 대화하던 상대가 앉아있습니다.
          </p>
          <p className="deep-3d-text mb-4 text-3xl">
            이제는 서로의 눈을 마주할 시간입니다.
          </p>
          <p className="deep-3d-text mb-4 text-3xl">
            눈앞에 있는 그 사람은 당신이 찾고 있던 진짜 사랑일까요? 직접
            확인해보세요.😊
          </p>
        </div>
      </div>
    </>
  );
};

export default Intro;
