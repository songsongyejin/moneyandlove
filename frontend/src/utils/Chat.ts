// chatClient.ts
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import axios from "axios";
const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
let client: CompatClient | null = null;
//받아온 msg 타입
type chatType = {
  roomId: number;
  senderId: number;
  message: string;
  createdAt: string;
};
export const connectHandler = (token: string): Promise<CompatClient> => {
  return new Promise((resolve, reject) => {
    const socketFactory = () =>
      new SockJS(`${APPLICATION_SERVER_URL}websocket`);
    client = Stomp.over(socketFactory);

    client.connect(
      {
        Authorization: `Bearer ${token}`,
      },
      () => {
        console.log("연결 성공");
        resolve(client as CompatClient);
      },
      (error: React.ChangeEvent<HTMLInputElement>) => {
        console.error("Connection error:", error);
        reject(error);
      }
    );
  });
};
export const subscribeHandler = (
  client: CompatClient,
  roomId: number,
  setChatData: React.Dispatch<React.SetStateAction<chatType[]>>
) => {
  if (client) {
    return client.subscribe(
      `/api/chat/receive/${roomId}`,
      (message) => {
        setChatData((prevMessages: any) => [
          ...prevMessages,
          JSON.parse(message.body),
        ]);
      },
      { Authorization: client.ws?.url.split("Authorization=")[1] || "" }
    );
  }
};
export const unSUbscribe = (roomId: number) => {
  if (client) {
    client.unsubscribe(`/api/receive/chat/room/${roomId}`);
  }
};

export const sendHandler = (token: string, roomId: number, message: string) => {
  if (client && client.connected) {
    client.send(
      `/api/chat/send/${roomId}`,
      { Authorization: `Bearer ${token}` },
      JSON.stringify({
        roomId: roomId,
        message: message,
      })
    );
  } else {
    console.error("STOMP client is not connected");
  }
};

export const disconnectHandler = () => {
  if (client) {
    client.disconnect();
  }
};

export const fetchAllChatData = async (roomId: number, token: string) => {
  try {
    const response = await axios.get(
      `${APPLICATION_SERVER_URL}chat/room/${roomId}/message`,
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
