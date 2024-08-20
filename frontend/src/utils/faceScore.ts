import axios from "axios";

const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

/**
 * 얼굴 점수를 조회하는 함수
 * @param {string} token - 인증을 위한 JWT 토큰
 * @returns {Promise<number>} - 얼굴 점수
 */
export const fetchFaceScore = async (token: string): Promise<number> => {
  try {
    const response = await axios.get(`${APPLICATION_SERVER_URL}face/score`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.faceScore;
  } catch (err) {
    console.error(err);
    throw err; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};

/**
 * 얼굴 점수를 수정하는 함수
 * @param {string} token - 인증을 위한 JWT 토큰
 * @param {number} faceScore - 수정할 얼굴 점수
 * @returns {Promise<void>} - 성공적으로 수정되면 아무것도 반환하지 않음
 */
export const updateFaceScore = async (
  token: string,
  faceScore: number
): Promise<void> => {
  try {
    const response = await axios.put(
      `${APPLICATION_SERVER_URL}face/score`,
      {
        faceScore,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("얼굴 점수 수정 성공");
    }
  } catch (err) {
    console.error(err);
    throw err; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};
