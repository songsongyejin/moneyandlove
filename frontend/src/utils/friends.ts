import axios from "axios";
const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
export const fetchFriendsListData = async (token: string) => {
  try {
    const response = await axios.get(`${APPLICATION_SERVER_URL}friends`, {
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

export const addFriend = async (
  token: string,
  followingId: number,
  followerId: number
) => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}friends`,
      {
        followingId, // 나의 ID
        followerId, // 상대의 ID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      console.log("친구 추가 성공");
    }

    return response.data;
  } catch (err) {
    console.error(err);
    throw err; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};
