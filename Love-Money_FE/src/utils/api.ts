import axios from "axios";
import { userToken } from "../atom/store";
import { useRecoilValue } from "recoil";

const APPLICATION_SERVER_URL = "http://i11a405.p.ssafy.io:8080/";
// const token = useRecoilValue(userToken);
// 세션 생성 함수
export const createSession = async (sessionId: string): Promise<string> => {
  try {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "video-sessions",
      { customSessionId: sessionId },
      {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3MjI4MzQ1NDgsImV4cCI6MTcyNTQyNjU0OCwic3ViIjoidGVzdDFAbmF2ZXIuY29tIiwiaWQiOjIsIm5pY2tuYW1lIjoidGVzdDEifQ.ZPd7am55uzIpM6oB8yIj-TGfqG54HDz5DIW9peWI96edNM1WtUpmgid9NdEkXg9X`,
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
export const createToken = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    APPLICATION_SERVER_URL + "video-sessions/" + sessionId + "/connections",
    {},
    {
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3MjI4MzQ1NDgsImV4cCI6MTcyNTQyNjU0OCwic3ViIjoidGVzdDFAbmF2ZXIuY29tIiwiaWQiOjIsIm5pY2tuYW1lIjoidGVzdDEifQ.ZPd7am55uzIpM6oB8yIj-TGfqG54HDz5DIW9peWI96edNM1WtUpmgid9NdEkXg9X`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("에러야? :" + response.data);
  return response.data; // The token
};
