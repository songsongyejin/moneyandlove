// components/whats-it-to-ya/Discussion.tsx
import React from "react";

interface DiscussionProps {
  onNextPhase: () => void;
}
const Discussion: React.FC<DiscussionProps> = ({ onNextPhase }) => {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center">
      <div
        className="absolute flex -translate-y-1/2 transform animate-fadeIn items-center whitespace-nowrap text-center text-white"
        style={{
          fontFamily: "DungGeunMo",
          bottom: "17%",
        }}
      >
        <div>
          <p className="deep-3d-text mb-3 text-4xl">
            이제 서로 대화하는 시간을 가져보세요
          </p>

          <p className="deep-3d-text mb-3 text-2xl">
            TIP: 자신의 포지션 선택에 대해 어필해보세요!
          </p>
        </div>
      </div>
      {/* 다음으로 넘어가는 버튼 */}
      <div className="fixed bottom-10">
        <button
          onClick={onNextPhase}
          className="three-d-button reset"
          style={{ fontFamily: "DungGeunMo" }}
        >
          최종 선택 단계로 넘어가기
        </button>
      </div>
    </div>
  );
};

export default Discussion;
