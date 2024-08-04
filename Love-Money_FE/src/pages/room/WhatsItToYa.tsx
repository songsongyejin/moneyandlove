import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Intro from "../../components/whats-it-to-ya/Intro";
import SelectTurn from "../../components/whats-it-to-ya/SelectTurn";
import FirstTurnFirstPlayerPlay from "../../components/whats-it-to-ya/first-turn/FirstPlayerPlay";
import FirstTurnSecondPlayerWait from "../../components/whats-it-to-ya/first-turn/SecondPlayerWait";
import FirstTurnFirstPlayerWait from "../../components/whats-it-to-ya/first-turn/FirstPlayerWait";
import FirstTurnScore from "../../components/whats-it-to-ya/first-turn/Score";

interface CardType {
  id: string;
  number: number;
}

const WhatsItToYa: React.FC = () => {
  // Intro 화면 표시 여부를 관리하는 state
  const [showIntro, setShowIntro] = useState(true);
  // 사용자의 플레이 순서를 관리하는 state
  const [selectedTurn, setSelectedTurn] = useState<null | number>(null);
  // 게임 단계 관리 state
  const [gamePhase, setGamePhase] = useState("SELECT_TURN");
  // 플레이어1의 드롭존 상태
  const [player1DropZones, setplayer1DropZones] = useState<CardType[][]>(
    Array.from({ length: 5 }, () => [])
  );

  // const [player2GuessZones, setPlayer2GuessZones] = useState<CardType[][]>(
  //   Array.from({ length: 5 }, () => [])
  // );

  // 플레이어 2의 예측 데이터를 하드코딩하여 테스트
  const mockPlayer2GuessZones: CardType[][] = [
    [{ id: "card-1", number: 1 }],
    [{ id: "card-2", number: 2 }],
    [{ id: "card-3", number: 3 }],
    [{ id: "card-4", number: 4 }],
    [{ id: "card-5", number: 5 }],
  ];

  // 서버에서 데이터를 받은 것처럼 시뮬레이션하는 상태
  const [dataReceived, setDataReceived] = useState(false);

  // 3초 후 Intro 화면을 숨기고 SelectTurn 화면을 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 턴 선택이 완료되었을 때 호출되는 함수
  const handleTurnSelected = (cardIndex: number) => {
    setSelectedTurn(cardIndex);
    if (cardIndex === 1) {
      // Player 1이 선인 경우
      setGamePhase("FIRST_PLAYER_PLAY");
    } else {
      // Player 2가 선인 경우
      setGamePhase("SECOND_PLAYER_WAIT");
    }
  };

  // First Player가 우선순위 선택 완료 시 호출되는 함수
  const handleFirstPlayerFinalize = (newDropZones: CardType[][]) => {
    setplayer1DropZones(newDropZones);
    setGamePhase("FIRST_PLAYER_WAIT");
  };

  // 서버에서 데이터를 받은 것처럼 상태를 변경
  useEffect(() => {
    if (gamePhase === "FIRST_PLAYER_WAIT") {
      const dataFetchTimer = setTimeout(() => {
        setDataReceived(true); // 데이터 수신 완료로 상태 변경
      }, 5000); // 5초 후 데이터 수신 시뮬레이션

      return () => clearTimeout(dataFetchTimer);
    }
  }, [gamePhase]);

  useEffect(() => {
    if (dataReceived) {
      setGamePhase("FIRST_TURN_SCORE");
    }
  }, [dataReceived]);

  // // Second Player가 예측을 완료한 후 호출되는 함수
  // const handleSecondPlayerFinalize = (newGuessZones: CardType[][]) => {
  //   setPlayer2GuessZones(newGuessZones);
  //   setGamePhase("FIRST_TURN_SCORE");
  // };

  // // 바로 점수 계산 단계로 이동하여 테스트
  // const handleGoToScore = () => {
  //   setGamePhase("FIRST_TURN_SCORE");
  // };

  return (
    <DndProvider backend={HTML5Backend}>
      // 배경 이미지와 레이아웃을 설정하는 컨테이너
      <div className="absolute inset-0 bg-main-bg bg-cover bg-center">
        {/* 반투명한 검은색 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        {/* 게임 컴포넌트를 중앙에 배치하는 컨테이너 */}
        <div className="pt-30 fixed inset-0 z-50 flex items-center justify-center">
          {/* 조건부 렌더링: 인트로 화면, 턴 선택 화면 또는 (사용자의 플레이 순서에 따른) 플레이 화면 */}
          {showIntro ? (
            <Intro />
          ) : gamePhase === "SELECT_TURN" ? (
            <SelectTurn onTurnSelected={handleTurnSelected} />
          ) : gamePhase === "FIRST_PLAYER_PLAY" ? (
            <FirstTurnFirstPlayerPlay onFinalize={handleFirstPlayerFinalize} />
          ) : gamePhase === "FIRST_PLAYER_WAIT" ? (
            <FirstTurnFirstPlayerWait dropZones={player1DropZones} />
          ) : gamePhase === "FIRST_TURN_SCORE" ? (
            <FirstTurnScore
              player1DropZones={player1DropZones}
              player2GuessZones={mockPlayer2GuessZones}
            />
          ) : (
            <FirstTurnSecondPlayerWait />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default WhatsItToYa;
