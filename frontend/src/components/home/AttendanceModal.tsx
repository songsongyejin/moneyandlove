import React, { useState, useEffect } from "react";
import { userInfo, UserInfo, userToken } from "../../atom/store";
import { useRecoilState } from "recoil";
import BaseModal from "./BaseModal";
import { FaRegCheckCircle } from "react-icons/fa";
import {
  fetchAttendance,
  markAttendance,
  updateUserPoints,
} from "../../utils/attendance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttendanceDay {
  attendanceDate: string;
  check: boolean;
}

const daysOfWeek = ["MON", "TUS", "WED", "THR", "FRI", "SAT", "SUN"];

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isCheckedToday, setIsCheckedToday] = useState(false);
  const [currentMonthWeek, setCurrentMonthWeek] = useState<string>("");
  const [user, setUser] = useRecoilState(userInfo);
  const [token, setToken] = useRecoilState(userToken);
  const queryClient = useQueryClient();

  const { data: attendanceDays, isLoading } = useQuery<AttendanceDay[], Error>({
    queryKey: ["attendance", token],
    queryFn: () => {
      if (!token) throw new Error("Token is null");
      return fetchAttendance(token);
    },
    enabled: isOpen && !!token,
  });

  useEffect(() => {
    if (attendanceDays) {
      const today = new Date().toISOString().split("T")[0];
      setIsCheckedToday(
        attendanceDays.find((day) => day.attendanceDate === today)?.check ||
          false
      );
      setCurrentMonthWeek(getCurrentMonthWeek());
    }
  }, [attendanceDays]);

  const markAttendanceMutation = useMutation<void, Error, void>({
    mutationFn: () => {
      if (!token) throw new Error("Token is null");
      return markAttendance(token);
    },
    onSuccess: async () => {
      console.log("출석체크 완료");
      setIsCheckedToday(true);

      if (user && token) {
        // 포인트를 100 추가
        try {
          await updateUserPoints(token, 100); // 추가된 포인트 업데이트 함수 호출

          const updatedUser: UserInfo = {
            ...user,
            gamePoint: user.gamePoint + 100,
          };
          setUser(updatedUser);

          queryClient.invalidateQueries({ queryKey: ["attendance", token] });
        } catch (error) {
          console.error("포인트 업데이트 실패:", error);
        }
      }
    },
    onError: (error: Error) => {
      console.error("체크 오류:", error);
    },
  });

  const handleAttendanceCheck = () => {
    if (token) {
      markAttendanceMutation.mutate();
    }
  };

  // 현재 월과 주차를 계산하는 함수
  const getCurrentMonthWeek = (): string => {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
    const date = now.getDate();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekNumber = Math.ceil((date + firstDayOfMonth.getDay() - 1) / 7);

    return `${month}월 ${weekNumber}주차`;
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
            {attendanceDays?.map((day: AttendanceDay) => (
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
