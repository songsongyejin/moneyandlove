// chatClient.ts
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

let client: CompatClient | null = null;

export const connectHandler = (
  token: string,
  setMessage: (message: any) => void
): CompatClient => {
  const socketFactory = () =>
    new SockJS("https://i11a405.p.ssafy.io/websocket");
  client = Stomp.over(socketFactory);

  client.connect(
    {
      Authorization: `Bearer ${token}`,
    },
    () => {
      if (client) {
        client.subscribe(
          `/chat/receive/1`,
          (message) => {
            setMessage(JSON.parse(message.body));
          },
          { Authorization: token ? token : "" }
        );
      }
    },
    (error: React.ChangeEvent<HTMLInputElement>) => {
      console.error("Connection error:", error);
    }
  );

  return client;
};

export const sendHandler = (token: string, roomId: number, message: string) => {
  if (client && client.connected) {
    client.send(
      `/chat/send/1`,
      { Authorization: `Bearer ${token}` },
      JSON.stringify({
        roomId: 1,
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
