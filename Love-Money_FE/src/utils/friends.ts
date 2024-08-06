import axios from "axios";

export const fetchFriendsListData = async (token: string) => {
  try {
    const response = await axios.get("https://i11a405.p.ssafy.io/friends", {
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
