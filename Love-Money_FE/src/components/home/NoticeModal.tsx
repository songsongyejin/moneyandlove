import React from "react";
import BaseModal from "./BaseModal"; // BaseModal 경로를 적절히 수정하세요.

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  footer?: React.ReactNode;
}

const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  onClose,
  title,
  footer,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <div
        className="flex h-full flex-col items-center justify-evenly p-4 text-left text-lg"
        style={{ fontFamily: "DungGeunMo" }}
      >
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold text-custom-purple-color">
            [필수] 게임 시작 전 아래 가이드에 따라 설정을 먼저 진행해주세요.
          </p>
          <p className=" ">
            (미설정 시 게임이 정상적으로 동작하지 않을 수 있습니다.)
          </p>
        </div>
        <div>
          <p className="">
            1. [크롬 브라우저로 접속] → [설정] → [시스템 설정] → [가능한 경우
            그래픽 가속 사용] 활성화
          </p>
          <p className="">
            2. 주소창에 <code>chrome://flags</code>를 입력한 후 '모두 재설정'을
            클릭하여 설정 초기화
          </p>
        </div>
      </div>
    </BaseModal>
  );
};

export default NoticeModal;
