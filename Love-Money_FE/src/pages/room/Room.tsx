import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  useCallback,
} from "react";
import {
  OpenVidu,
  Session,
  Publisher,
  StreamManager,
  Device,
} from "openvidu-browser";
import useSessionHandlers from "../../hooks/useSessionHandlers";
import JoinSessionForm from "../../components/room/JoinSessionForm";
import GameView from "../../components/room/GameView";
import { createSession, createToken } from "../../utils/api";
import { useRecoilValue } from "recoil";
import { maxExpressionState, warning } from "../../atom/store";

// Room 컴포넌트
const Room: React.FC = () => {
  //recoil 전역변수
  const maxExpression = useRecoilValue(maxExpressionState);
  const warningMsg = useRecoilValue(warning);
  //감정을 이모지로 변환
  const expressionToEmoji = (expression: string): string => {
    const emojis: { [key: string]: string } = {
      happy: "😊",
      sad: "😢",
      angry: "😡",
      fearful: "😨",
      disgusted: "🤢",
      surprised: "😲",
      neutral: "😐",
    };
    return emojis[expression] || "😐";
  };
  // 상태 변수 설정

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [mode, setMode] = useState<string>("chat");
  const [mySessionId, setMySessionId] = useState<string>("SessionA");
  const [myUserName, setMyUserName] = useState<string>(
    "Participant" + Math.floor(Math.random() * 100)
  );
  const [session, setSession] = useState<Session | undefined>();
  const [mainStreamManager, setMainStreamManager] = useState<
    StreamManager | undefined
  >();
  const [publisher, setPublisher] = useState<Publisher | undefined>();
  const [subscriber, setSubscriber] = useState<StreamManager | undefined>();
  const [messages, setMessages] = useState<
    { user: string; text: string; Emoji: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const currentVideoDevice = useRef<Device | undefined>();

  // 세션 핸들러 설정
  const deleteSubscriber = useSessionHandlers(
    session,
    setSubscriber,
    setMessages
  );

  // 페이지를 떠날 때 세션 종료
  useEffect(() => {
    const handleBeforeUnload = () => leaveSession();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [session]);

  // 세션 ID 변경 핸들러
  const handleChangeSessionId = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMySessionId(e.target.value);

  // 사용자 이름 변경 핸들러
  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMyUserName(e.target.value);

  // 메인 비디오 스트림 설정 핸들러
  // const handleMainVideoStream = (stream: StreamManager) => {
  //   setMainStreamManager((prev) => (prev !== stream ? stream : prev));
  // };

  // 토큰 얻기 함수
  const getToken = useCallback(async (): Promise<string> => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  }, [mySessionId]);

  // 세션 참가 함수
  const joinSession = async (e: FormEvent) => {
    e.preventDefault();
    const OV = new OpenVidu();
    const session = OV.initSession();

    setSession(session);

    try {
      const token = await getToken();
      await session.connect(token, { clientData: myUserName });

      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 60,
        insertMode: "APPEND",
        mirror: true,
      });

      session.publish(publisher);

      const devices = await OV.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const currentVideoDeviceId = publisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .getSettings().deviceId;
      currentVideoDevice.current = videoDevices.find(
        (device) => device.deviceId === currentVideoDeviceId
      );

      setPublisher(publisher);
      setMainStreamManager(publisher);
    } catch (error) {
      console.error(
        "There was an error connecting to the session:",
        error.code,
        error.message
      );
    }
  };

  // 세션 떠나기 함수
  const leaveSession = () => {
    if (session) session.disconnect();
    setSession(undefined);
    setSubscriber(undefined);
    setMySessionId("SessionA");
    setMyUserName("Participant" + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (
      session &&
      newMessage.trim() &&
      expressionToEmoji(maxExpression).trim()
    ) {
      session.signal({
        data: JSON.stringify({
          user: myUserName,
          text: newMessage,
          Emoji: expressionToEmoji(maxExpression),
        }),
        to: [],
        type: "chat",
      });
      setNewMessage("");
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-main-bg bg-cover bg-center"></div>
      <div className="absolute inset-0 -z-10 bg-black opacity-40"></div>
      {mode === "chat" && warningMsg && (
        <div className="absolute left-32 top-1/2 rounded bg-red-500 p-2 text-white">
          {warningMsg}
        </div>
      )}
      {session === undefined ? (
        <JoinSessionForm
          joinSession={joinSession}
          myUserName={myUserName}
          mySessionId={mySessionId}
          handleChangeUserName={handleChangeUserName}
          handleChangeSessionId={handleChangeSessionId}
        />
      ) : (
        <GameView
          mode={mode}
          setMode={setMode}
          mainStreamManager={mainStreamManager}
          subscriber={subscriber}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          leaveSession={leaveSession}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          myUserName={myUserName}
        />
      )}
    </div>
  );
};

export default Room;
