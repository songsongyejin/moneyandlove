import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import { FaRegCheckCircle } from "react-icons/fa";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttendanceDay {
  day: string;
  date: number;
  checked: boolean;
  reward: number;
}

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [attendanceDays, setAttendanceDays] = useState<AttendanceDay[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckedToday, setIsCheckedToday] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const mockAttendance = daysOfWeek.map((day, index) => {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + index);
        return {
          day,
          date: currentDate.getDate(),
          checked: currentDate <= today && Math.random() > 0.3, // 오늘 이전 날짜는 랜덤하게 체크
          reward: (index + 1) * 10,
        };
      });

      setAttendanceDays(mockAttendance);
      setCurrentStreak(calculateStreak(mockAttendance));
      setIsLoading(false);
    }
  }, [isOpen]);

  const calculateStreak = (days: AttendanceDay[]) => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].checked) streak++;
      else break;
    }
    return streak;
  };

  const handleAttendanceCheck = () => {
    // 여기에 출석 체크 로직을 구현합니다.
    // 예: API 호출 후 상태 업데이트
    console.log("출석 체크됨");
    // 출석 체크 완료 후 상태 업데이트
    setIsCheckedToday(true);

    // 오늘의 출석 상태를 업데이트
    const updatedDays = attendanceDays.map((day) =>
      day.date === new Date().getDate() ? { ...day, checked: true } : day
    );
    setAttendanceDays(updatedDays);

    // 연속 출석 일수 업데이트
    setCurrentStreak(calculateStreak(updatedDays));
  };

  const getDayColor = (day: string) => {
    switch (day) {
      case "일":
        return "#F3409D";
      case "토":
        return "#1A00FF";
      default:
        return "black";
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <p>로딩 중...</p>;
    }
    return (
      <div className="flex h-full w-full flex-col">
        <div className="mb-24 text-center text-xl">
          <p>현재 연속 출석: {currentStreak}일</p>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {attendanceDays.map((day) => (
            <div
              key={day.day}
              className={`flex h-24 flex-col items-center justify-center rounded p-2 ${
                day.checked ? "bg-custom-purple-color" : "bg-gray-100"
              }`}
            >
              <span
                style={{
                  color: getDayColor(day.day),
                  fontFamily: "DNFBitBitv2",
                }}
              >
                {day.day}
              </span>
              <span>{day.reward}P</span>
              {day.checked && (
                <span>
                  <FaRegCheckCircle style={{ fontSize: "40px" }} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFooter = () => (
    <div className="mb-4 flex w-full flex-col items-center">
      {isCheckedToday ? (
        <p
          className="rounded-lg px-8 py-3 text-lg text-white"
          style={{
            backgroundColor: "#E6E6E8",
            fontFamily: "DNFBitBitv2",
          }}
        >
          출석완료
        </p>
      ) : (
        <button
          onClick={handleAttendanceCheck}
          className="bg-custom-purple-color rounded-lg px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110 active:brightness-90"
          style={{
            fontFamily: "DNFBitBitv2",
          }}
        >
          출석하기
        </button>
      )}
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="이번 주 출석체크"
      footer={renderFooter()}
    >
      {renderContent()}
    </BaseModal>
  );
};

export default AttendanceModal;
