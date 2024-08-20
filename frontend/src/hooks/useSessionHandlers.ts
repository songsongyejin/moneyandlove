import { useEffect } from "react";
import { Session, StreamManager } from "openvidu-browser";

// 세션 관련 이벤트 핸들러를 설정하는 custom hook
const useSessionHandlers = (
  session: Session | undefined,
  setSubscriber: React.Dispatch<
    React.SetStateAction<StreamManager | undefined>
  >,
  setMessages: React.Dispatch<
    React.SetStateAction<{ user: string; text: string }[]>
  >
) => {
  // 구독자 삭제 함수
  const deleteSubscriber = (streamManager: StreamManager) => {
    setSubscriber((prev) => (prev === streamManager ? undefined : prev));
  };

  // 세션 이벤트 핸들러 설정
  useEffect(() => {
    if (!session) return;

    // 스트림 생성 이벤트 핸들러
    const streamCreatedHandler = (event: any) => {
      const newSubscriber = session.subscribe(event.stream, undefined);
      console.log(newSubscriber);
      setSubscriber(newSubscriber);
    };

    // 스트림 삭제 이벤트 핸들러
    const streamDestroyedHandler = (event: any) => {
      deleteSubscriber(event.stream.streamManager);
    };

    // 예외 처리 핸들러
    const exceptionHandler = (exception: any) => {
      console.warn(exception);
    };

    // 채팅 신호 수신 핸들러
    const signalChatHandler = (event: any) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // 이벤트 핸들러 등록
    session.on("streamCreated", streamCreatedHandler);
    session.on("streamDestroyed", streamDestroyedHandler);
    session.on("exception", exceptionHandler);
    session.on("signal:chat", signalChatHandler);

    // 컴포넌트 언마운트 시 이벤트 핸들러 제거
    return () => {
      session.off("streamCreated", streamCreatedHandler);
      session.off("streamDestroyed", streamDestroyedHandler);
      session.off("exception", exceptionHandler);
      session.off("signal:chat", signalChatHandler);
    };
  }, [session, setSubscriber, setMessages]);

  return deleteSubscriber;
};

export default useSessionHandlers;
