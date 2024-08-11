import React, { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Intro from "../whats-it-to-ya/Intro";
import SelectTurn from "../whats-it-to-ya/SelectTurn";
import FirstTurnFirstPlayerPlay from "../whats-it-to-ya/first-turn/FirstPlayerPlay";
import FirstTurnFirstPlayerWait from "../whats-it-to-ya/first-turn/FirstPlayerWait";
import FirstTurnFirstPlayerScoreBoard from "../whats-it-to-ya/first-turn/FirstPlayerScoreBoard";
import FirstTurnSecondPlayerWait from "../../components/whats-it-to-ya/first-turn/SecondPlayerWait";
import FirstTurnSecondPlayerPlay from "../../components/whats-it-to-ya/first-turn/SecondPlayerPlay";
import FirstTurnSecondPlayerScoreBoard from "../whats-it-to-ya/first-turn/SecondPlayerScoreBoard";
import SecondTurnFirstPlayerWait from "../../components/whats-it-to-ya/second-turn/FirstPlayerWait";
import SecondTurnFirstPlayerPlay from "../../components/whats-it-to-ya/second-turn/FirstPlayerPlay";
import SecondTurnFirstPlayerScoreBoard from "../whats-it-to-ya/second-turn/FirstPlayerScoreBoard";
import SecondTurnSecondPlayerPlay from "../../components/whats-it-to-ya/second-turn/SecondPlayerPlay";
import SecondTurnSecondPlayerWait from "../../components/whats-it-to-ya/second-turn/SecondPlayerWait";
import SecondTurnSecondPlayerScoreBoard from "../whats-it-to-ya/second-turn/SecondPlayerScoreBoard";
import Result from "../whats-it-to-ya/Result";
import Discussion from "../whats-it-to-ya/Discussion";
import FinalSelection from "../whats-it-to-ya/FinalSelection";

import { useWordCards } from "../../hooks/useWordCards";
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
  // wordCards 상태를 관리하는 useState 훅
  const [wordCards, setWordCards] = useState<WordCard[]>([]);
  // 훅에서 카드를 가져옴 (플레이어 1용)
  const { wordCards: generatedWordCards, loading, error } = useWordCards();
  const [introParticipants, setIntroParticipants] = useState(new Set<string>());
  // Intro 완료 상태
  const isIntroCompleted = useRef(false);

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

  const [winner, setWinner] = useState<string | null>(null);
  const [loser, setLoser] = useState<string | null>(null);

  //-----------------------------------------------------------------------------//
  // 사용자가 Intro 화면에 진입했음을 알리는 신호 전송
  useEffect(() => {
    if (isIntroCompleted.current) return; // Intro가 완료된 경우 더 이상 실행되지 않음

    const sendIntroSignal = () => {
      session
        .signal({
          data: session.connection.connectionId,
          to: [],
          type: "intro",
        })
        .then(() => {
          console.log("Intro 신호가 성공적으로 전송되었습니다.");
        })
        .catch((error) => {
          console.error("Intro 신호 전송 중 오류가 발생했습니다:", error);
        });
    };

    sendIntroSignal();

    // 다른 사용자의 신호 수신 처리
    const handleIntroSignal = (event: any) => {
      const newParticipants = new Set(introParticipants);
      newParticipants.add(event.data);
      setIntroParticipants(newParticipants);
      console.log("현재 Intro 참가자:", newParticipants);

      // 전체 참가자가 2명 이상일 때만 화면 전환
      const totalParticipants = session.remoteConnections.size + 1; // 자신을 포함한 전체 참가자 수
      if (totalParticipants > 1 && newParticipants.size === totalParticipants) {
        console.log(
          "모든 참가자가 Intro에 접속했습니다. 3초 후에 화면을 전환합니다..."
        );
        setTimeout(() => {
          console.log("SelectTurn 화면으로 전환합니다.");
          isIntroCompleted.current = true; // Intro 완료 상태 설정
          setShowIntro(false);
          setGamePhase("SELECT_TURN");
        }, 3000);
      }
    };

    session.on("signal:intro", handleIntroSignal);

    return () => {
      session.off("signal:intro", handleIntroSignal); // Intro 신호 처리기를 제거
    };
  }, [session, introParticipants]);

  // gamePhase 상태 변화를 로그로 확인
  useEffect(() => {
    console.log("현재 gamePhase 상태:", gamePhase);
  }, [gamePhase]);

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
  // Player 1의 선택 완료 시 (버튼 누르면) 데이터 전송
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

  // 플레이어 1이 플레이어2의 예측을 기다리는 중

  // 서버에서 플레이어2의 예측존을 받음
  useEffect(() => {
    // 플레이어 2의 예측 데이터 수신
    session.on("signal:player2GuessZones", (event: any) => {
      const receivedGuessZones = JSON.parse(event.data);
      setPlayer2GuessZones(receivedGuessZones);
      console.log("플레이어2 게스존 받음");
      // 플레이어2의 예측 데이터를 받았으면, 점수계산으로 이동
      setGamePhase("FIRST_TURN_FIRST_PLAYER_SCORE");
    });
    return () => {
      session.off("signal:player2GuessZones");
    };
  }, [session]);

  // 첫번째게임 스코어보드에서 다음 게임으로 넘어가기
  const handlePlayer1NextTurn = () => {
    // 다음 게임 단계로 전환하는 로직 추가
    setGamePhase("SECOND_TURN_FIRST_PLAYER_WAIT");
  };

  // 플레이어 1 두번째 게임
  // 서버에서 플레이어2의 데이터를 받음
  useEffect(() => {
    // 플레이어 2의 드롭존 데이터 수신
    session.on("signal:player2DropZones", (event: any) => {
      const receivedDropZones = JSON.parse(event.data);
      setPlayer2DropZones(receivedDropZones);
      setGamePhase("SECOND_TURN_FIRST_PLAYER_PLAY");
    });
    return () => {
      session.off("signal:player2DropZones");
    };
  }, [session]);

  // 플레이어 1이 예측을 완료한 후 호출되는 함수
  const handleSecondTurnFirstPlayerFinalize = (newGuessZones: CardType[][]) => {
    setPlayer1GuessZones(newGuessZones);
    session
      .signal({
        data: JSON.stringify(newGuessZones),
        to: [],
        type: "player1GuessZones",
      })
      .then(() => {
        console.log("플레이어1 예측 전송 완료");
        setGamePhase("SECOND_TURN_SCORE");
      })
      .catch((error) =>
        console.error("Error sending player1GuessZones:", error)
      );
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
      // 플레이어1 드롭존 받으면 이제 플레이어2가 예측할 차례
      setGamePhase("FIRST_TURN_SECOND_PLAYER_PLAY");
    });
    return () => {
      session.off("signal:player1DropZones");
    };
  }, [session]);

  // 플레이어 2의 첫 번째 턴 예측 완료 처리
  const handleFirstTurnSecondPlayerFinalize = (newGuessZones: CardType[][]) => {
    setPlayer2GuessZones(newGuessZones);
    session
      .signal({
        data: JSON.stringify(newGuessZones),
        to: [],
        type: "player2GuessZones",
      })
      .then(() => {
        console.log("플레이어2 예측 전송 완료");
        setGamePhase("FIRST_TURN_SECOND_PLAYER_SCORE");
      })
      .catch((error) =>
        console.error("Error sending player2GuessZones:", error)
      );
  };

  // 첫번째게임 스코어보드에서 다음 게임으로 넘어가기
  const handlePlayer2NextTurn = () => {
    // 다음 게임 단계로 전환하는 로직 추가
    setGamePhase("SECOND_TURN_SECOND_PLAYER_PLAY");
  };

  // 플레이어2 두번째게임
  // 플레이어2가 본인의 우선순위 선택 후 호출되는 함수
  const handleSecondTurnSecondPlayerFinalize = (newDropZones: CardType[][]) => {
    setPlayer2DropZones(newDropZones);
    session
      .signal({
        data: JSON.stringify(newDropZones),
        to: [],
        type: "player2DropZones",
      })
      .then(() => {
        console.log("플레이어2 드롭존 전송 완료");
        setGamePhase("SECOND_TURN_SECOND_PLAYER_WAIT");
      })
      .catch((error) =>
        console.error("Error sending player2DropZones:", error)
      );
  };

  // 플레이어 2가 플레이어1의 예측을 기다리는 중
  // 서버에서 플레이어1의 데이터를 받음
  useEffect(() => {
    // 플레이어 1의 예측 데이터 수신 (플레이어 2 시점)
    session.on("signal:player1GuessZones", (event: any) => {
      const receivedGuessZones = JSON.parse(event.data);
      setPlayer1GuessZones(receivedGuessZones);
      setGamePhase("SECOND_TURN_TEMPSCORE");
    });

    return () => {
      session.off("signal:player1GuessZones");
    };
  }, [session]);

  // ----------------------------------------------------------------- //
  // 첫번째 게임 점수 계산
  // 점수 계산 후 콘솔에 출력하는 함수
  const handlePlayer2ScoreCalculated = (score: number) => {
    setPlayer2Score(score);
    console.log("최종 점수:", score);
  };

  // 두번째 게임 점수 계산
  // 점수 계산 후 콘솔에 출력하는 함수
  const handlePlayer1ScoreCalculated = (score: number) => {
    setPlayer1Score(score);
    console.log("최종 점수:", score);
  };

  // 두번째게임 스코어보드에서 승자 패배 화면으로 이동
  const handleResultPhase = () => {
    // 승리자와 패배자 결정
    if (player1Score > player2Score) {
      setWinner("Player 1");
      setLoser("Player 2");
    } else if (player1Score < player2Score) {
      setWinner("Player 2");
      setLoser("Player 1");
    } else {
      setWinner("Draw");
      setLoser("Draw");
    }

    // 다음 게임 단계로 전환하는 로직 추가
    setGamePhase("RESULT");
  };

  // DISCUSSION 단계로 전환하는 함수
  const handleDiscussionPhase = () => {
    setGamePhase("DISCUSSION");
  };

  const handleFinalSelectionPhase = () => {
    setGamePhase("FINAL_SELECTION");
  };

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
      ) : gamePhase === "FIRST_TURN_FIRST_PLAYER_SCORE" ? (
        <FirstTurnFirstPlayerScoreBoard
          player1DropZones={player1DropZones}
          player2GuessZones={player2GuessZones}
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
        <SecondTurnFirstPlayerScoreBoard
          player1GuessZones={player1GuessZones}
          player2DropZones={player2DropZones}
          onScoreCalculated={handlePlayer1ScoreCalculated} // 콜백 함수 전달
          onNextPhase={handleResultPhase}
          wordCards={wordCards}
        />
      ) : gamePhase === "FIRST_TURN_SECOND_PLAYER_WAIT" ? (
        <FirstTurnSecondPlayerWait wordCards={wordCards} />
      ) : gamePhase === "FIRST_TURN_SECOND_PLAYER_PLAY" ? (
        <FirstTurnSecondPlayerPlay
          onFinalize={handleFirstTurnSecondPlayerFinalize}
          wordCards={wordCards}
        />
      ) : gamePhase === "FIRST_TURN_SECOND_PLAYER_SCORE" ? (
        <FirstTurnSecondPlayerScoreBoard
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
        <SecondTurnSecondPlayerScoreBoard
          player1GuessZones={player1GuessZones}
          player2DropZones={player2DropZones}
          onScoreCalculated={handlePlayer1ScoreCalculated} // 콜백 함수 전달
          onNextPhase={handleResultPhase}
          wordCards={wordCards}
        />
      ) : gamePhase === "RESULT" ? (
        <Result
          winner={winner}
          loser={loser}
          userRole={selectedTurn === 1 ? "Player 1" : "Player 2"}
          onNextPhase={handleDiscussionPhase} // 버튼 클릭 시 DISCUSSION 단계로 이동
        />
      ) : gamePhase === "DISCUSSION" ? (
        <Discussion onNextPhase={handleFinalSelectionPhase} />
      ) : gamePhase === "FINAL_SELECTION" ? (
        <FinalSelection onNextPhase={handleFinalSelectionPhase} /> // 최종선택 단계를 위한 컴포넌트
      ) : null}
    </DndProvider>
  );
};

export default WhatsItToYa;
