import React from "react";
import BaseModal from "./BaseModal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="내 프로필">
      개발중
    </BaseModal>
  );
};

export default ProfileModal;
