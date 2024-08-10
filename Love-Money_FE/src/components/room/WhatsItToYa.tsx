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
import SecondTurnFirstPlayerWait from "../../components/whats-it-to-ya/second-turn/FirstPlayerWait";
import SecondTurnFirstPlayerPlay from "../../components/whats-it-to-ya/second-turn/FirstPlayerPlay";
import SecondTurnScoreBoard from "../../components/whats-it-to-ya/second-turn/Score";
import Winner from "../../components/whats-it-to-ya/Winner";
import SecondTurnSecondPlayerPlay from "../../components/whats-it-to-ya/second-turn/SecondPlayerPlay";
import SecondTurnSecondPlayerWait from "../../components/whats-it-to-ya/second-turn/SecondPlayerWait";
import SecondTurnTempScoreBoard from "../../components/whats-it-to-ya/second-turn/TempScore";
import { useWordCards } from "../../hooks/useWordCards"; // 5개의 단어카드 커스텀훅 임포트
import CafeBackground from "../../assets/cafe-background.jpg";
import aiBot from "../../assets/ai_bot.gif";
import { Session } from "openvidu-browser";

interface CardType {
  id: string;
  number: number;
}

interface WordCard {
  id: string;
  word: string;
  bgColor: string;
  textColor: string;
}

const WhatsItToYa: React.FC<{ session: Session }> = ({ session }) => {
  // Intro 화면 표시 여부를 관리하는 state
  const [showIntro, setShowIntro] = useState(true);
  // 사용자의 플레이 순서를 관리하는 state
  const [selectedTurn, setSelectedTurn] = useState<null | number>(null);
  // 게임 단계 관리 state
  const [gamePhase, setGamePhase] = useState("SELECT_TURN");
  const [wordCards, setWordCards] = useState<WordCard[]>([]); // wordCards 상태를 관리하는 useState 훅
  const { wordCards: generatedWordCards, loading, error } = useWordCards(); // 훅에서 카드를 가져옴 (플레이어 1용)

  // 첫번째 게임
  // 플레이어1의 드롭존 상태
  const [player1DropZones, setPlayer1DropZones] = useState<CardType[][]>(
    Array.from({ length: 5 }, () => [])
  );
  // 플레이어2의 예측존 상태
  const [player2GuessZones, setPlayer2GuessZones] = useState<CardType[][]>(
    Array.from({ length: 5 }, () => [])
  );
  //  첫번째 게임 점수 상태
  const [player2Score, setPlayer2Score] = useState<number>(0);

  // 두번째 게임
  // 플레이어2의 드롭존 상태
  const [player2DropZones, setPlayer2DropZones] = useState<CardType[][]>(
    Array.from({ length: 5 }, () => [])
  );
  // 플레이어1의 예측존 상태
  const [player1GuessZones, setPlayer1GuessZones] = useState<CardType[][]>(
    Array.from({ length: 5 }, () => [])
  );
  // 두번째 게임 점수 상태
  const [player1Score, setPlayer1Score] = useState<number>(0);

  // 승자를 저장하는 state
  const [winner, setWinner] = useState<string | null>(null);

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
      setGamePhase("FIRST_TURN_FIRST_PLAYER_PLAY");
    } else {
      // Player 2 선택 (후공)
      setGamePhase("FIRST_TURN_SECOND_PLAYER_WAIT");
    }
  };

  // 플레이어 1이 생성한 단어 카드 배열을 세션을 통해 전송
  useEffect(() => {
    if (selectedTurn === 1 && gamePhase === "FIRST_TURN_FIRST_PLAYER_PLAY") {
      setWordCards(generatedWordCards); // 플레이어 1이 생성한 단어 카드를 설정
      session
        .signal({
          data: JSON.stringify(generatedWordCards),
          to: [],
          type: "wordCards",
        })
        .then(() => {
          console.log("Word cards sent:", generatedWordCards);
        })
        .catch((error) => {
          console.error("Error sending word cards:", error);
        });
    }
  }, [generatedWordCards, selectedTurn, gamePhase]);

  // 플레이어 2가 단어 카드 배열을 세션에서 수신
  useEffect(() => {
    if (selectedTurn === 2) {
      session.on("signal:wordCards", (event: any) => {
        const receivedWordCards = JSON.parse(event.data);
        setWordCards(receivedWordCards); // 플레이어 2는 수신된 단어 카드를 설정
        console.log("Received word cards:", receivedWordCards);
      });
    }
  }, [session, selectedTurn]);

  // ------------------------------------------------------------------------- //
  // 플레이어1 시점
  // 첫번째 게임
  // 플레이어1이 우선순위 선택 완료 시 호출되는 함수
  // Player 1의 선택 완료 시 데이터 전송
  const handleFirstTurnFirstPlayerFinalize = (newDropZones: CardType[][]) => {
    setPlayer1DropZones(newDropZones);
    session
      .signal({
        data: JSON.stringify(newDropZones),
        to: [],
        type: "player1DropZones",
      })
      .then(() => {
        console.log("플레이어1 드롭존 보냄");
        setGamePhase("FIRST_TURN_FIRST_PLAYER_WAIT");
      })
      .catch((error) => {
        console.error("Error sending player1DropZones:", error);
      });
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
  const [firstTurnPlayer2dataReceived, setfirstTurnPlayer2DataReceived] =
    useState(false);
  // 서버에서 데이터를 받은 것처럼 상태를 변경
  useEffect(() => {
    if (gamePhase === "FIRST_TURN_FIRST_PLAYER_WAIT") {
      const dataFetchTimer = setTimeout(() => {
        setfirstTurnPlayer2DataReceived(true); // 데이터 수신 완료로 상태 변경
      }, 5000); // 5초 후 데이터 수신 시뮬레이션

      return () => clearTimeout(dataFetchTimer);
    }
  }, [gamePhase]);

  // 플레이어2의 예측 데이터를 받았으면, 점수계산으로 이동
  useEffect(() => {
    if (firstTurnPlayer2dataReceived) {
      setGamePhase("FIRST_TURN_SCORE");
    }
  }, [firstTurnPlayer2dataReceived]);

  // 첫번째 게임 점수 계산
  // 점수 계산 후 콘솔에 출력하는 함수
  const handlePlayer2ScoreCalculated = (score: number) => {
    setPlayer2Score(score);
    console.log("최종 점수:", score);
  };

  // 첫번째게임 스코어보드에서 다음 게임으로 넘어가기
  const handlePlayer1NextTurn = () => {
    // 다음 게임 단계로 전환하는 로직 추가
    setGamePhase("SECOND_TURN_FIRST_PLAYER_WAIT");
  };

  // ------------------------------------------------------------------//
  // 플레이어 1 두번째 게임
  // 서버에서 플레이어2의 데이터를 받은 것처럼 시뮬레이션하는 상태
  const [secondTurnPlayer2dataReceived, setSecondTurnPlayer2dataReceived] =
    useState(false);
  // 서버에서 데이터를 받은 것처럼 상태를 변경
  useEffect(() => {
    if (gamePhase === "SECOND_TURN_FIRST_PLAYER_WAIT") {
      const dataFetchTimer = setTimeout(() => {
        setSecondTurnPlayer2dataReceived(true); // 데이터 수신 완료로 상태 변경
      }, 5000); // 5초 후 데이터 수신 시뮬레이션

      return () => clearTimeout(dataFetchTimer);
    }
  }, [gamePhase]);

  // 플레이어1의 선택 데이터를 받았으면, 본인의 예측 플레이 단계로 이동
  useEffect(() => {
    if (secondTurnPlayer2dataReceived) {
      setGamePhase("SECOND_TURN_FIRST_PLAYER_PLAY");
    }
  }, [secondTurnPlayer2dataReceived]);

  // 플레이어 1이 예측을 완료한 후 호출되는 함수
  const handleSecondTurnFirstPlayerFinalize = (newGuessZones: CardType[][]) => {
    setPlayer1GuessZones(newGuessZones);
    setGamePhase("SECOND_TURN_SCORE");
  };
  // 플레이어 2의 DropZones를 하드코딩하여 테스트
  const mockPlayer2DropZones: CardType[][] = [
    [{ id: "card-1", number: 1 }],
    [{ id: "card-2", number: 2 }],
    [{ id: "card-3", number: 3 }],
    [{ id: "card-4", number: 4 }],
    [{ id: "card-5", number: 5 }],
  ];

  // 두번째 게임 점수 계산
  // 점수 계산 후 콘솔에 출력하는 함수
  const handlePlayer1ScoreCalculated = (score: number) => {
    setPlayer1Score(score);
    console.log("최종 점수:", score);
  };

  // 두번째게임 스코어보드에서 승자 패배 화면으로 이동
  const handleWinnerPhase = () => {
    // 다음 게임 단계로 전환하는 로직 추가
    setGamePhase("WINNER");
  };

  // ------------------------------------------------------------------- //
  // 플레이어2 시점
  // 플레이어 2가 플레이어1의 우선순위 선택을 기다리는 중

  // 세션에서 플레이어1의 드롭존 우선순위를 받음
  useEffect(() => {
    session.on("signal:player1DropZones", (event: any) => {
      const receivedData = JSON.parse(event.data);
      setPlayer1DropZones(receivedData);
      console.log("플레이어1 드롭존 받음");
      setGamePhase("FIRST_TURN_SECOND_PLAYER_PLAY");
    });
  }, [session]);

  // 플레이어 2가 예측을 완료한 후 호출되는 함수
  const handleFirstTurnSecondPlayerFinalize = (newGuessZones: CardType[][]) => {
    setPlayer2GuessZones(newGuessZones);
    setGamePhase("FIRST_TURN_TEMPSCORE");
  };

  // 첫번째게임 스코어보드에서 다음 게임으로 넘어가기
  const handlePlayer2NextTurn = () => {
    // 다음 게임 단계로 전환하는 로직 추가
    setGamePhase("SECOND_TURN_SECOND_PLAYER_PLAY");
  };

  // 플레이어2가 본인의 우선순위 선택 후 호출되는 함수
  const handleSecondTurnSecondPlayerFinalize = (newDropZones: CardType[][]) => {
    setPlayer2DropZones(newDropZones);
    setGamePhase("SECOND_TURN_SECOND_PLAYER_WAIT");
  };

  // 플레이어 1의 GuessZones를 하드코딩하여 테스트
  const mockPlayer1GuessZones: CardType[][] = [
    [{ id: "card-1", number: 1 }],
    [{ id: "card-2", number: 2 }],
    [{ id: "card-3", number: 3 }],
    [{ id: "card-4", number: 4 }],
    [{ id: "card-5", number: 5 }],
  ];

  // 플레이어 2가 플레이어1의 예측을 기다리는 중
  // 서버에서 플레이어1의 데이터를 받은 것처럼 시뮬레이션하는 상태
  const [secondTurnPlayer1dataReceived, setSecondTurnPlayer1dataReceived] =
    useState(false);
  // 서버에서 데이터를 받은 것처럼 상태를 변경
  useEffect(() => {
    if (gamePhase === "SECOND_TURN_SECOND_PLAYER_WAIT") {
      const dataFetchTimer = setTimeout(() => {
        setSecondTurnPlayer1dataReceived(true); // 데이터 수신 완료로 상태 변경
      }, 5000); // 5초 후 데이터 수신 시뮬레이션

      return () => clearTimeout(dataFetchTimer);
    }
  }, [gamePhase]);

  // 플레이어1의 예측 데이터를 받았으면, 점수계산으로 이동
  useEffect(() => {
    if (secondTurnPlayer1dataReceived) {
      setGamePhase("SECOND_TURN_TEMPSCORE");
    }
  }, [secondTurnPlayer1dataReceived]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* 조건부 렌더링: 인트로 화면, 턴 선택 화면 또는 (사용자의 플레이 순서에 따른) 플레이 화면 */}
      {showIntro ? (
        <Intro />
      ) : gamePhase === "SELECT_TURN" ? (
        <SelectTurn onTurnSelected={handleTurnSelected} session={session} />
      ) : gamePhase === "FIRST_TURN_FIRST_PLAYER_PLAY" ? (
        <FirstTurnFirstPlayerPlay
          onFinalize={handleFirstTurnFirstPlayerFinalize}
          wordCards={wordCards}
        />
      ) : gamePhase === "FIRST_TURN_FIRST_PLAYER_WAIT" ? (
        <FirstTurnFirstPlayerWait
          dropZones={player1DropZones}
          wordCards={wordCards}
        />
      ) : gamePhase === "FIRST_TURN_SCORE" ? (
        <FirstTurnScoreBoard
          player1DropZones={player1DropZones}
          player2GuessZones={mockPlayer2GuessZones}
          onScoreCalculated={handlePlayer2ScoreCalculated} // 콜백 함수 전달
          onNextPhase={handlePlayer1NextTurn} // 다음 단계로 넘어가기 위한 콜백 전달
          wordCards={wordCards}
        />
      ) : gamePhase === "SECOND_TURN_FIRST_PLAYER_WAIT" ? (
        <SecondTurnFirstPlayerWait wordCards={wordCards} />
      ) : gamePhase === "SECOND_TURN_FIRST_PLAYER_PLAY" ? (
        <SecondTurnFirstPlayerPlay
          onFinalize={handleSecondTurnFirstPlayerFinalize}
          wordCards={wordCards}
        />
      ) : gamePhase === "SECOND_TURN_SCORE" ? (
        <SecondTurnScoreBoard
          player1GuessZones={player1GuessZones}
          player2DropZones={mockPlayer2DropZones}
          onScoreCalculated={handlePlayer1ScoreCalculated} // 콜백 함수 전달
          onNextPhase={handleWinnerPhase}
          wordCards={wordCards}
        />
      ) : gamePhase === "FIRST_TURN_SECOND_PLAYER_WAIT" ? (
        <FirstTurnSecondPlayerWait wordCards={wordCards} />
      ) : gamePhase === "FIRST_TURN_SECOND_PLAYER_PLAY" ? (
        <FirstTurnSecondPlayerPlay
          onFinalize={handleFirstTurnSecondPlayerFinalize}
          wordCards={wordCards}
        />
      ) : gamePhase === "FIRST_TURN_TEMPSCORE" ? (
        <FirstTurnTempScoreBoard
          player1DropZones={player1DropZones}
          player2GuessZones={player2GuessZones}
          onScoreCalculated={handlePlayer2ScoreCalculated} // 콜백 함수 전달
          onNextPhase={handlePlayer2NextTurn} // 다음 단계로 넘어가기 위한 콜백 전달
          wordCards={wordCards}
        />
      ) : gamePhase === "SECOND_TURN_SECOND_PLAYER_PLAY" ? (
        <SecondTurnSecondPlayerPlay
          onFinalize={handleSecondTurnSecondPlayerFinalize}
          wordCards={wordCards}
        />
      ) : gamePhase === "SECOND_TURN_SECOND_PLAYER_WAIT" ? (
        <SecondTurnSecondPlayerWait
          dropZones={player2DropZones}
          wordCards={wordCards}
        />
      ) : gamePhase === "SECOND_TURN_TEMPSCORE" ? (
        <SecondTurnTempScoreBoard
          player1GuessZones={mockPlayer1GuessZones}
          player2DropZones={player2DropZones}
          onScoreCalculated={handlePlayer1ScoreCalculated} // 콜백 함수 전달
          onNextPhase={handleWinnerPhase}
          wordCards={wordCards}
        />
      ) : gamePhase === "WINNER" ? (
        <Winner
          player1Score={player1Score}
          player2Score={player2Score}
          userRole={selectedTurn === 1 ? "Player 1" : "Player 2"}
        />
      ) : null}
    </DndProvider>
  );
};

export default WhatsItToYa;
