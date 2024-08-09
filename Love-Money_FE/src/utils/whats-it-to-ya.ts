import axios from "axios";
const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
// 단어 카드 데이터를 가져오는 API 호출 함수
export const fetchWordCards = async (token: string): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(
      `${APPLICATION_SERVER_URL}whats-it-to-ya`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Word Cards:", response.data); // 디버깅을 위한 콘솔 로그
    return response.data;
  } catch (err: any) {
    console.error(
      "Failed to fetch word cards:",
      err.response?.data || err.message
    );
    throw err; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};
