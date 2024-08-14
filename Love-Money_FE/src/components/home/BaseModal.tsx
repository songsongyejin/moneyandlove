import React, { ReactNode } from "react";
import close from "../../assets/close.png";
// 공통모달창
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달창 배경 */}

      <div
        className="relative flex h-[500px] w-[750px] flex-col justify-between overflow-hidden rounded-[20px] border-4 border-black shadow-custom"
        style={{
          backgroundColor: "#F0E9F6",
          opacity: "var(--sds-size-stroke-border)",
        }}
      >
        {/* 모달창 헤더 */}
        <div
          className="relative flex w-full items-center justify-between rounded-t-[8px] border-b-4 border-black p-4"
          style={{
            backgroundColor: "#8B6CAC",
          }}
        >
          {/* 모달창 제목 */}
          <h2
            className="flex-grow text-center text-2xl text-white"
            style={{ fontFamily: "DNFBitBitv2" }}
          >
            {title}
          </h2>
          {/* 모달창 닫기버튼 */}
          <div className="flex items-center justify-end">
            <button
              className="flex items-center justify-center text-white"
              onClick={onClose}
            >
              <img src={close} alt="" className="w-8" />
            </button>
          </div>
        </div>
        {/* 모달창 내용 */}
        <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center overflow-y-auto p-6 text-center text-black">
          {children}
        </div>
        {/* 모달창 하단 */}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default BaseModal;
