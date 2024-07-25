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
  const [attendanceDays, setAttendanceDays] = useState<AttendanceDay[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="출석체크">
      <div className="flex h-full w-full flex-col">asfas</div>
    </BaseModal>
  );
};

export default AttendanceModal;
