import axios from "axios";

export const fetchUserData = async (token: string) => {
  try {
    const response = await axios.get("http://i11a405.p.ssafy.io:8080/user/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};
