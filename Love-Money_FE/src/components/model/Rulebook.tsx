import React, { useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";

interface RulebookProps {
  isOpen: boolean;
  onClose: () => void;
}

const Rulebook: React.FC<RulebookProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative flex h-[500px] w-[600px] flex-col justify-between rounded-lg p-4"
        style={{
          backgroundColor: "#FFF1F1",
          opacity: "var(--sds-size-stroke-border)",
        }}
      >
        <button className="absolute right-4 top-4 text-black" onClick={onClose}>
          <IoCloseCircleOutline size={45} color="#C47297" />
        </button>
        <h2 className="mb-4 mt-4 text-center text-4xl font-bold">
          How to Play
        </h2>
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto">
          <div
            className="p-4 text-center text-black"
            dangerouslySetInnerHTML={{ __html: pages[currentPage] }}
          ></div>
        </div>
        {/* 모달창 하단 이전, 다음, 페이지 div */}
        <div className="mt-4 flex items-center justify-between">
          <button
            className={`${
              currentPage === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            <FaArrowCircleLeft size={45} color="#C47297" />
          </button>
          <span className="text-2xl text-black">
            {currentPage + 1} / {pages.length}
          </span>
          <button
            className={`${
              currentPage === pages.length - 1
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            onClick={handleNextPage}
            disabled={currentPage === pages.length - 1}
          >
            <FaArrowCircleRight size={45} color="#C47297" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rulebook;
