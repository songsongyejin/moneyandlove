import axios from "axios";
const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

// 출석 조회 API
export const fetchAttendance = async (
  token: string
): Promise<AttendanceDay[]> => {
  try {
    const response = await axios.get<AttendanceDay[]>(
      `${APPLICATION_SERVER_URL}attendance`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Status Code:", response.status);
    // console.log("Response Headers:", response.headers);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("사용자 출석체크 못 불러옴:", error);
    throw error; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};

// 출석 기록 API
export const markAttendance = async (token: string): Promise<void> => {
  try {
    await axios.post(
      `${APPLICATION_SERVER_URL}attendance`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("출석체크 완료");
  } catch (error) {
    console.error("출석체크 실패:", error);
    throw error; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};

// AttendanceDay 인터페이스를 정의합니다.
export interface AttendanceDay {
  attendanceDate: string;
  check: boolean;
}
