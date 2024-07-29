import React, { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

// 공통모달창
interface AgreeFaceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AgreeFaceChatModal: React.FC<AgreeFaceChatModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center bg-black bg-opacity-50">
      {/* 모달창 배경 */}
      <div
        className="relative ml-40 flex h-[300px] w-[500px] flex-col justify-between overflow-hidden rounded-[20px]"
        style={{
          backgroundColor: "#F0E9F6",
          opacity: "var(--sds-size-stroke-border)",
        }}
      >
        {/* 모달창 헤더 */}
        <div
          className="relative flex w-full items-center justify-between rounded-t-[8px] p-4"
          style={{
            backgroundColor: "#8B6CAC",
          }}
        >
          {/* 왼쪽 여백을 위한 빈 div */}
          <div className="w-24"></div>
          {/* 모달창 제목 */}
          <h2
            className="flex-grow text-center text-2xl text-white"
            style={{ fontFamily: "DNFBitBitv2" }}
          >
            {title}
          </h2>
          {/* 모달창 닫기버튼 */}
          <div className="flex w-24 items-center justify-end">
            <button
              className="flex items-center justify-center text-white"
              onClick={onClose}
            >
              <IoClose size={32} />
            </button>
          </div>
        </div>
        {/* 모달창 내용 */}
        <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center overflow-y-auto p-6 text-center text-black">
          {children}
        </div>
        {/* 모달창 하단 */}

        {footer && <div className="mt-4">{footer} </div>}
      </div>
    </div>
  );
};

export default AgreeFaceChatModal;
