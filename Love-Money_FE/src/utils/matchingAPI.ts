import axios from "axios";
const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
export const matching = async (
  token: string,
  position: string,
  matchType: string
) => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}matching`,
      { position: position, matchType: matchType },
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

export const cancelMatching = async (
  token: string,
  position: string,
  matchType: string
) => {
  try {
    const response = await axios.put(
      `${APPLICATION_SERVER_URL}matching`,
      { position: position, matchType: matchType },
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
