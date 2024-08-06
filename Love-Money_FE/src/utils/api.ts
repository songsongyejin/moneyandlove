import axios from "axios";
import { userToken } from "../atom/store";
import { useRecoilValue } from "recoil";

const APPLICATION_SERVER_URL = "https://i11a405.p.ssafy.io/";
// const token = useRecoilValue(userToken);
// 세션 생성 함수
export const createSession = async (
  sessionId: string,
  token: string
): Promise<string> => {
  try {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "video-sessions",
      { customSessionId: sessionId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data; // The sessionId
  } catch (error) {
    console.error("Error creating session:", error);
    throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 다시 던집니다.
  }
};

// 토큰 생성 함수
export const createToken = async (
  sessionId: string,
  token: string
): Promise<string> => {
  const response = await axios.post(
    APPLICATION_SERVER_URL + "video-sessions/" + sessionId + "/connections",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("에러야? :" + response.data);
  return response.data; // The token
};
