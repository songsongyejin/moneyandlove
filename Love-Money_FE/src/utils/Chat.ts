// chatClient.ts
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import axios from "axios";
const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
let client: CompatClient | null = null;

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
  setMessage: (message: any) => void
) => {
  if (client) {
    console.log(`${roomId} 구독`);
    client.subscribe(
      `/chat/receive/${roomId}`,
      (message) => {
        setMessage(JSON.parse(message.body));
      },
      { Authorization: client.ws?.url.split("Authorization=")[1] || "" }
    );
  }
};
export const sendHandler = (token: string, roomId: number, message: string) => {
  if (client && client.connected) {
    client.send(
      `/chat/send/${roomId}`,
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
    console.log("받아온다");
    const response = await axios.get(
      `${APPLICATION_SERVER_URL}chat/room/${roomId}/message`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err; // 필요에 따라 에러를 다시 던질 수 있습니다.
  }
};
