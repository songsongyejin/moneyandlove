import { useRef } from "react";

const client = useRef<CompatClient>();

const connectHaner = () => {
  clicent.current = Stomp.over(() => {
    const sock = new SockJS("http://localhost:8080/{백에서 설정한 end point}");
    return sock;
  });
  client.current.connect(
    {
      // 여기에서 유효성 검증을 위해 header를 넣어줄 수 있음.
      // ex)
      Authorization: token,
    },
    () => {
      // callback 함수 설정, 대부분 여기에 sub 함수 씀
      client.current.subscribe(
        `/백엔드와 협의한 api주소/{구독하고 싶은 방의 id}`,
        (message) => {
          setMessage(JSON.parse(message.body));
        },
        {
          // 여기에도 유효성 검증을 위한 header 넣어 줄 수 있음
        }
      );
    }
  );
};
