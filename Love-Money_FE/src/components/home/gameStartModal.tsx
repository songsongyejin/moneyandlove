import React, { ReactNode } from "react";
import "./position.css";
import close from "../../assets/close.png";

// 공통모달창
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const gameStartModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  // Determine if the fade-in-bottom class should be applied
  const modalClass = title === "포지션 선택" ? "fade-in-bottom" : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달창 배경 */}

      <div
        className={`outLine ${modalClass} relative flex h-[600px] w-[850px] flex-col items-center justify-center overflow-hidden border-4 border-black p-8`}
        style={{
          backgroundColor: "#3d2368",
          opacity: "var(--sds-size-stroke-border)",
        }}
      >
        {/* 모달창 닫기버튼 */}
        <div className="absolute right-4 top-12 flex items-center justify-end">
          <button
            className="flex items-center justify-center text-white"
            onClick={onClose}
          >
            <img src={close} alt="닫기" className="w-8" />
          </button>
        </div>
        {/* 모달창 내용 */}
        <div className="tv flex items-center justify-center border-4 border-black bg-gray-200">
          {children}
        </div>
        {/* 모달창 하단 */}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default gameStartModal;
