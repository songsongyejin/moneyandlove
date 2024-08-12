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
import { maxExpressionState, userToken } from "../../atom/store";
import mainBg from "../assets/main_bg.png";
// Room 컴포넌트
const Room: React.FC = () => {
  //recoil 전역변수
  const maxExpression = useRecoilValue(maxExpressionState);
  const token = useRecoilValue(userToken);
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
    const sessionId = await createSession(mySessionId, token ? token : "");
    return await createToken(sessionId, token ? token : "");
  }, [mySessionId]);

  // 세션 참가 함수
  const joinSession = async (e: FormEvent) => {
    e.preventDefault();
    const OV = new OpenVidu();
    const session = OV.initSession();

    setSession(session);

    try {
      const token = await getToken();
      console.log("토큰", token);
      await session.connect(token, { clientData: myUserName });
      const devices = await OV.getDevices();
      console.log(devices + " :::::devices");
      const videoDevices = devices.filter((device) => {
        console.log(device + " :::::::device");
        device.kind === "videoinput";
      });
      console.log("비디오디바이스", videoDevices);
      // 첫 번째 사용 가능한 비디오 장치 선택
      const selectedDevice = videoDevices.length > 0 ? videoDevices[0] : null;
      const videoSource = selectedDevice ? selectedDevice.deviceId : undefined;

      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: videoSource,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 60,
        insertMode: "APPEND",
        mirror: true,
      });

      session.publish(publisher);

      const currentVideoDeviceId = publisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .getSettings().deviceId;
      currentVideoDevice.current = videoDevices.find(
        (device) => device.deviceId === currentVideoDeviceId
      );
      console.log(publisher);
      setPublisher(publisher);
      setMainStreamManager(publisher);
    } catch (error) {
      const typedError = error as { code: string; message: string }; // 오류 타입 명시
      console.error(
        "There was an error connecting to the session:",
        typedError.code,
        typedError.message
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
      <img
        src={mainBg}
        alt=""
        className={`absolute inset-0 h-screen w-screen bg-cover bg-center`}
      />
      <div className="absolute inset-0 -z-10 bg-black opacity-40"></div>

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
          session={session}
        />
      )}
    </div>
  );
};

export default Room;
