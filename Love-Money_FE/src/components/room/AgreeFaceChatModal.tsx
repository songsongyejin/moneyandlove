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
    <div
      style={{ fontFamily: "DungGeunMo" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      {/* 모달창 배경 */}
      <div className="flex h-[500px] w-[900px] flex-col justify-center overflow-hidden rounded-[20px]">
        <div className="flex w-full max-w-4xl flex-col items-center justify-center overflow-y-auto p-6 text-center text-xl text-white">
          {children}
        </div>
        {/* 모달창 하단 */}

        {footer && <div>{footer} </div>}
      </div>
    </div>
  );
};

export default AgreeFaceChatModal;
