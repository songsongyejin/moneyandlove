// utils/updateGamePoints.ts
import axios from "axios";

const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface UpdateGamePointsParams {
  gamePoint: number;
  token: string;
}

export const updateGamePoints = async ({
  gamePoint,
  token,
}: UpdateGamePointsParams): Promise<void> => {
  try {
    const response = await axios.put(
      `${APPLICATION_SERVER_URL}user/points`,
      { gamePoint: gamePoint },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      console.log("포인트 변경 성공");
    } else {
      console.log("포인트 변경 실패", response.status);
    }
  } catch (error) {
    console.error("API 요청 중 오류 발생", error);
    throw error;
  }
};
