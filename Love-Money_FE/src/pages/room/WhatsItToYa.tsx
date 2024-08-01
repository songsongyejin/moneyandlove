import React, { useState, useEffect } from "react";
import SelectTurn from "../../components/whatsittoya/SelectTurn";
import MainGame from "../../components/whatsittoya/MainGame";
import Intro from "../../components/whatsittoya/Intro";

const WhatsItToYa: React.FC = () => {
  // Intro 화면 표시 여부를 관리하는 state
  const [showIntro, setShowIntro] = useState(true);
  // 메인 게임 화면 표시 여부를 관리하는 state
  const [showMainGame, setshowMainGame] = useState(false);

  // 3초 후 Intro 화면을 숨기고 SelectTurn 화면을 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 턴 선택이 완료되었을 때 호출되는 함수
  const handleTurnSelected = () => {
    setshowMainGame(true);
  };

  return (
    // 배경 이미지와 레이아웃을 설정하는 컨테이너
    <div className="absolute inset-0 bg-main-bg bg-cover bg-center">
      {/* 반투명한 검은색 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      {/* 게임 컴포넌트를 중앙에 배치하는 컨테이너 */}
      <div className="pt-30 fixed inset-0 z-50 flex items-center justify-center">
        {/* 조건부 렌더링: 인트로 화면, 턴 선택 화면 또는 메인 게임 화면 */}
        {showIntro ? (
          <Intro />
        ) : !showMainGame ? (
          <SelectTurn onTurnSelected={handleTurnSelected} />
        ) : (
          <MainGame />
        )}
      </div>
    </div>
  );
};

export default WhatsItToYa;
