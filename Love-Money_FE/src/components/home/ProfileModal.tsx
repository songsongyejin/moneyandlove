import React from "react";
import BaseModal from "./BaseModal";
import { userInfo } from "../../atom/store";
import { useRecoilValue } from "recoil";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const user = useRecoilValue(userInfo);

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="내 프로필">
      <img src={user?.profileURL} alt="프로필" />
      <p>닉네임: {user?.nickname}</p>
      <p>나이: {user?.age}</p>
      <p>성별: {user?.gender}</p>
      <p>포인트: {user?.points}</p>
    </BaseModal>
  );
};

export default ProfileModal;
