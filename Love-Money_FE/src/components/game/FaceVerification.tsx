import React, { useState } from "react";
import BaseModal from "../home/BaseModal";

interface FaceVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({
  isOpen,
  onClose,
  onVerificationComplete,
}) => {
  const handleVerification = () => {
    // 여기에 실제 인증 로직을 추가할 수 있습니다.
    // 지금은 단순히 인증 완료로 처리합니다.
    onVerificationComplete();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="얼굴 인증">
      <div className="flex flex-col items-center">
        <p className="mb-6 text-center text-lg">
          인증되지 않은 사용자는 첫 인증 후 play 할 수 있습니다.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleVerification}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            인증하기
          </button>
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-400"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default FaceVerification;
