import React, { useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import BaseModal from "./BaseModal";

interface RulebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulebookModal: React.FC<RulebookModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // 룰북 페이지 내용
  const pages = [
    "Money & Love는 온라인 연애 심리 게임입니다.",
    `<span style="font-size: 1.5em; font-weight: bold;">게임 방식</span> <br /> <br /> 플레이어는 Love 나 Money 중 하나를 선택합니다.<br /> 정체모를 상대방과 매칭되어 채팅과 화상 통화를 통해 서로를 알아갑니다. <br />왓츠잇투야 게임을 통해 상대방에 대해 더 깊이 이해할 수 있습니다.<br /> 최종적으로 LOVE 또는 MONEY를 선택합니다.`,
    `<span style="font-size: 1.5em; font-weight: bold;">결과</span> <br /> <br /> 둘 다 LOVE 선택: 매칭 성공! <br /> 친구 추가 가능 한 명만 MONEY 선택: MONEY 선택자가 포인트 획득 <br />둘 다 MONEY 선택: 매칭 실패, 포인트 손실`,
  ];

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 룰북 모달창 하단: 페이지 이전 다음
  const footer = (
    <div className="mt-4 flex items-center justify-between">
      <button
        className={`${currentPage === 0 ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={handlePreviousPage}
        disabled={currentPage === 0}
      >
        <FaArrowCircleLeft size={45} color="#8B6CAC" />
      </button>
      <span
        className="text-2xl"
        style={{ fontFamily: "DNFBitBitv2", color: "#8B6CAC" }}
      >
        {currentPage + 1} / {pages.length}
      </span>
      <button
        className={`${currentPage === pages.length - 1 ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={handleNextPage}
        disabled={currentPage === pages.length - 1}
      >
        <FaArrowCircleRight size={45} color="#8B6CAC" />
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play"
      footer={footer}
    >
      <div
        className="p-4 text-center text-black"
        dangerouslySetInnerHTML={{ __html: pages[currentPage] }}
      ></div>
    </BaseModal>
  );
};

export default RulebookModal;
