import { useState } from "react";

export const useGameLogic = () => {
  // 각 단계별 모달의 표시 여부를 관리하는 상태
  const [showFaceVerification, setShowFaceVerification] = useState(false); // 얼굴인증 단계
  const [showPositionSelection, setShowPositionSelection] = useState(false); // 포지션 선택단계
  const [showGameModeSelection, setShowGameModeSelection] = useState(false); // 게임모드 선택단계
  const [showMatching, setShowMatching] = useState(false); // 매칭단계

  // 사용자가 선택한 포지션과 게임 모드를 저장하는 상태
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<string | null>(null);

  // 게임 시작 버튼 클릭 시 호출되는 함수
  const handleGameStart = () => {
    // 일단 얼굴인증 되어있다고 가정
    setShowPositionSelection(true); // 포지션 선택 모달 띄움
  };

  // 포지션 선택 시 호출되는 함수
  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position); // 사용자가 선택한 포지션 저장
    setShowPositionSelection(false); // 포지션 선택 모달 닫기
    setShowGameModeSelection(true); // 게임모드 선택 모달 열기
  };

  // 게임 모드 선택 시 호출되는 함수
  const handleGameModeSelect = (mode: string) => {
    setGameMode(mode); // 사용자가 선택한 게임모드 저장
    setShowGameModeSelection(false); // 게임모드 선택 모달 닫기
    setShowMatching(true); // 매칭 모달 띄움
  };

  // 게임 모드 선택에서 포지션 선택으로 되돌아가는 함수
  const handleBackToPositionSelect = () => {
    setShowGameModeSelection(false); // 게임모드 선택 모달 닫기
    setShowPositionSelection(true); // 포지션 선택 모달 띄움
    setSelectedPosition(null);
  };

  // 게임 모드 선택 모달을 닫는 함수
  const handleGameModeSelectionClose = () => {
    setShowGameModeSelection(false);
    setSelectedPosition(null); // 포지션 초기화
    setGameMode(null); // 게임 모드도 초기화
  };

  // 매칭 시작 시 호출되는 함수
  const handleMatchStart = (position: string) => {
    console.log("매칭 시작", position);
    setShowPositionSelection(false);
    setShowMatching(true);
  };

  // 매칭 취소할 시 호출되는 함수
  const handleMatchingCancel = () => {
    setShowMatching(false);
    setSelectedPosition(null);
    setGameMode(null);
    setShowPositionSelection(false);
  };

  return {
    showFaceVerification,
    setShowFaceVerification,
    showPositionSelection,
    setShowPositionSelection,
    selectedPosition,
    setSelectedPosition,
    showGameModeSelection,
    setShowGameModeSelection,
    gameMode,
    setGameMode,
    showMatching,
    setShowMatching,
    handleGameStart,
    handlePositionSelect,
    handleGameModeSelect,
    handleGameModeSelectionClose,
    handleBackToPositionSelect,
    handleMatchStart,
    handleMatchingCancel,
  };
};
