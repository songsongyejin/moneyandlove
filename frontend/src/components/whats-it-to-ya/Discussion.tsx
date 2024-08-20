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
          bottom: "11%",
        }}
      >
        <div>
          <p className="deep-3d-text mb-3 text-2xl">게임이 종료되었습니다.</p>
          <p className="deep-3d-text mb-3 text-2xl">
            이야기하며 서로에 대해 더욱 자세히 알아보세요.
          </p>
          <p className="deep-3d-text mb-3 text-2xl">
            TIP: 자신이 Love임을 어필할 마지막 기회이자, 상대방이 Love를
            선택하도록 유도할 마지막 기회입니다.
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
