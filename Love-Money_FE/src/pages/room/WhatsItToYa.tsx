import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Intro from "../../components/whats-it-to-ya/Intro";
import SelectTurn from "../../components/whats-it-to-ya/SelectTurn";
import FirstTurnFirstPlayerPlay from "../../components/whats-it-to-ya/first-turn/FirstPlayerPlay";
import FirstTurnFirstPlayerWait from "../../components/whats-it-to-ya/first-turn/FirstPlayerWait";
import FirstTurnSecondPlayerWait from "../../components/whats-it-to-ya/first-turn/SecondPlayerWait";
import FirstTurnSecondPlayerPlay from "../../components/whats-it-to-ya/first-turn/SecondPlayerPlay";
import FirstTurnScoreBoard from "../../components/whats-it-to-ya/first-turn/Score";
import FirstTurnTempScoreBoard from "../../components/whats-it-to-ya/first-turn/TempScore";

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
  const [player1DropZones, setPlayer1DropZones] = useState<CardType[][]>(
    Array.from({ length: 5 }, () => [])
  );
  // 플레이어2의 예측존 상태
  const [player2GuessZones, setPlayer2GuessZones] = useState<CardType[][]>(
    Array.from({ length: 5 }, () => [])
  );

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
      // Player 1 선택 (선공)
      setGamePhase("FIRST_PLAYER_PLAY");
    } else {
      // Player 2 선택 (후공)
      setGamePhase("SECOND_PLAYER_WAIT");
    }
  };

  // ------------------------------------------------------------------------- //
  // 플레이어1 시점
  // 플레이어1이 우선순위 선택 완료 시 호출되는 함수
  const handleFirstPlayerFinalize = (newDropZones: CardType[][]) => {
    setPlayer1DropZones(newDropZones);
    setGamePhase("FIRST_PLAYER_WAIT");
  };

  // 플레이어 2의 GuessZones를 하드코딩하여 테스트
  const mockPlayer2GuessZones: CardType[][] = [
    [{ id: "card-1", number: 1 }],
    [{ id: "card-2", number: 2 }],
    [{ id: "card-3", number: 3 }],
    [{ id: "card-4", number: 4 }],
    [{ id: "card-5", number: 5 }],
  ];

  // 플레이어 1이 플레이어2의 예측을 기다리는 중
  // 서버에서 플레이어2의 데이터를 받은 것처럼 시뮬레이션하는 상태
  const [dataReceived, setDataReceived] = useState(false);
  // 서버에서 데이터를 받은 것처럼 상태를 변경
  useEffect(() => {
    if (gamePhase === "FIRST_PLAYER_WAIT") {
      const dataFetchTimer = setTimeout(() => {
        setDataReceived(true); // 데이터 수신 완료로 상태 변경
      }, 5000); // 5초 후 데이터 수신 시뮬레이션

      return () => clearTimeout(dataFetchTimer);
    }
  }, [gamePhase]);

  // 플레이어2의 예측 데이터를 받았으면, 점수계산으로 이동
  useEffect(() => {
    if (dataReceived) {
      setGamePhase("SCORE");
    }
  }, [dataReceived]);

  // ------------------------------------------------------------------- //
  // 플레이어2 시점
  // 플레이어 2가 플레이어1의 우선순위 선택을 기다리는 중
  // 서버에서 플레이어1의 데이터를 받은 것처럼 시뮬레이션하는 상태
  const [dataReceived2, setDataReceived2] = useState(false);
  // 서버에서 데이터를 받은 것처럼 상태를 변경
  useEffect(() => {
    if (gamePhase === "SECOND_PLAYER_WAIT") {
      const dataFetchTimer = setTimeout(() => {
        setDataReceived2(true); // 데이터 수신 완료로 상태 변경
      }, 5000); // 5초 후 데이터 수신 시뮬레이션

      return () => clearTimeout(dataFetchTimer);
    }
  }, [gamePhase]);

  // 플레이어1의 선택 데이터를 받았으면, 본인의 예측 플레이 단계로 이동
  useEffect(() => {
    if (dataReceived2) {
      setGamePhase("SECOND_PLAYER_PLAY");
    }
  }, [dataReceived2]);

  // 플레이어 1의 DropZones를 하드코딩하여 테스트
  const mockPlayer1DropZones: CardType[][] = [
    [{ id: "card-1", number: 1 }],
    [{ id: "card-2", number: 2 }],
    [{ id: "card-3", number: 3 }],
    [{ id: "card-4", number: 4 }],
    [{ id: "card-5", number: 5 }],
  ];
  // 플레이어 2가 예측을 완료한 후 호출되는 함수
  const handleSecondPlayerFinalize = (newGuessZones: CardType[][]) => {
    setPlayer2GuessZones(newGuessZones);
    setGamePhase("TEMPSCORE");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* // 배경 이미지와 레이아웃을 설정하는 컨테이너 */}
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
          ) : gamePhase === "SECOND_PLAYER_WAIT" ? (
            <FirstTurnSecondPlayerWait />
          ) : gamePhase === "SECOND_PLAYER_PLAY" ? (
            <FirstTurnSecondPlayerPlay
              onFinalize={handleSecondPlayerFinalize}
            />
          ) : gamePhase === "SCORE" ? (
            <FirstTurnScoreBoard
              player1DropZones={player1DropZones}
              player2GuessZones={mockPlayer2GuessZones}
            />
          ) : gamePhase === "TEMPSCORE" ? (
            <FirstTurnTempScoreBoard
              player1DropZones={mockPlayer1DropZones}
              player2GuessZones={player2GuessZones}
            />
          ) : null}
        </div>
      </div>
    </DndProvider>
  );
};

export default WhatsItToYa;
