import React from "react";
import BaseModal from "../home/BaseModal";

interface MatchingProps {
  isOpen: boolean;
  onClose: () => void;
}

const Matching: React.FC<MatchingProps> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="매칭 중">
      <div className="flex flex-col items-center">
        <p className="mb-4 text-xl">대전 상대를 찾고 있습니다...</p>
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
        <button
          onClick={onClose}
          className="mt-6 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          매칭 취소
        </button>
      </div>
    </BaseModal>
  );
};

export default Matching;
