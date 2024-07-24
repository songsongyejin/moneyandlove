import React from "react";
import BaseModal from "./BaseModal";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="출석체크">
      개발중
    </BaseModal>
  );
};

export default AttendanceModal;
