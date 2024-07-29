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
        <p
          className="mb-24 text-2xl"
          style={{
            fontFamily: "DNFBitBitv2",
            WebkitTextStroke: "0.01px #8B6CAC",
          }}
        >
          상대방을 찾고 있습니다
        </p>
        <div className="h-20 w-20 animate-spin rounded-full border-b-2 border-t-2 border-custom-purple-color"></div>
        <button
          onClick={onClose}
          className="mt-28 rounded-lg bg-fuchsia-700 px-8 py-3 text-lg text-white hover:bg-fuchsia-800"
          style={{
            fontFamily: "DNFBitBitv2",
          }}
        >
          매칭 취소
        </button>
      </div>
    </BaseModal>
  );
};

export default Matching;
