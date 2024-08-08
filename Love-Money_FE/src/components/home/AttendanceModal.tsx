import React, { useState, useEffect } from "react";
import { userInfo, UserInfo } from "../../atom/store";
import { useRecoilState } from "recoil";
import BaseModal from "./BaseModal";
import { FaRegCheckCircle } from "react-icons/fa";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttendanceDay {
  attendanceDate: string;
  check: boolean;
}

const daysOfWeek = ["MON", "TUS", "WED", "THR", "FRI", "SAT", "SUN"];

// API 호출을 시뮬레이션하는 함수
const mockFetchAttendance = (): Promise<AttendanceDay[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { attendanceDate: "2024-07-29", check: false },
        { attendanceDate: "2024-07-30", check: false },
        { attendanceDate: "2024-07-31", check: false },
        { attendanceDate: "2024-08-01", check: false },
        { attendanceDate: "2024-08-02", check: true },
        { attendanceDate: "2024-08-03", check: false },
        { attendanceDate: "2024-08-04", check: false },
      ]);
    }, 100);
  });
};

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [attendanceDays, setAttendanceDays] = useState<AttendanceDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckedToday, setIsCheckedToday] = useState(false);
  const [currentMonthWeek, setCurrentMonthWeek] = useState<string>("");
  const [user, setUser] = useRecoilState(userInfo);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      mockFetchAttendance().then((data) => {
        setAttendanceDays(data);
        setIsLoading(false);
        // 오늘 날짜의 출석 여부 확인
        const today = new Date().toISOString().split("T")[0];
        setIsCheckedToday(
          data.find((day) => day.attendanceDate === today)?.check || false
        );

        // 현재 월과 주차 계산
        setCurrentMonthWeek(getCurrentMonthWeek());
      });
    }
  }, [isOpen]);

  // 현재 월과 주차를 계산하는 함수
  const getCurrentMonthWeek = (): string => {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
    const date = now.getDate();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekNumber = Math.ceil((date + firstDayOfMonth.getDay() - 1) / 7);

    return `${month}월 ${weekNumber}주차`;
  };

  const handleAttendanceCheck = () => {
    // 여기에 출석 체크 API 호출 로직을 구현합니다.
    console.log("출석 체크됨");
    setIsCheckedToday(true);

    // 오늘의 출석 상태를 업데이트
    const today = new Date().toISOString().split("T")[0];
    const updatedDays = attendanceDays.map((day) =>
      day.attendanceDate === today ? { ...day, check: true } : day
    );
    setAttendanceDays(updatedDays);

    // 사용자 포인트 업데이트
    if (user) {
      const updatedUser: UserInfo = {
        ...user,
        points: user.points + 100,
      };
      setUser(updatedUser);
    }
  };

  const getDayColor = (day: string) => {
    switch (day) {
      case "SUN":
        return "#F3409D";
      case "SAT":
        return "#1A00FF";
      default:
        return "#6A5681";
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <p>로딩 중...</p>;
    }
    return (
      <div className="flex h-full w-full flex-col">
        <div
          className="mt-4 text-center text-2xl"
          style={{ fontFamily: "DNFBitBitv2" }}
        >
          {currentMonthWeek} 출석현황
        </div>
        <div className="mt-16 flex flex-col border border-gray-200 bg-white">
          <div className="grid grid-cols-7">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="border-b border-r border-gray-200 p-2 text-center"
              >
                <span
                  className="font-bold"
                  style={{
                    color: getDayColor(day),
                    fontFamily: "DNFBitBitv2",
                  }}
                >
                  {day}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {attendanceDays.map((day) => (
              <div
                key={day.attendanceDate}
                className="flex h-20 flex-col items-center justify-between border-r border-gray-200 p-4"
              >
                {day.check && (
                  <span className="text-custom-purple-color">
                    <FaRegCheckCircle style={{ fontSize: "48px" }} />
                  </span>
                )}
              </div>
            ))}
          </div>
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
          className="rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110 active:brightness-90"
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
