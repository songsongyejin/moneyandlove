import axios from "axios";
const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
export const fetchRanking = async (token: string) => {
  try {
    const response = await axios.get(
      `${APPLICATION_SERVER_URL}rankings`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error(err);
    throw err; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};

export const updateRankScore = async (token: string, rankPoint: number) => {
  try {
    const response = await axios.put(
      `${APPLICATION_SERVER_URL}rankings`,
      {
        rankPoint, // 랭킹 포인트
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("랭킹 포인트 변경 성공");
    }

    return response.data;
  } catch (err) {
    console.error(err);
    throw err; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};
