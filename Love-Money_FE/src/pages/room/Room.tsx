import React, { useState, useEffect, useRef, FormEvent } from "react";
import {
  OpenVidu,
  Session,
  Publisher,
  StreamManager,
  Device,
} from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "../../components/room/UserVideoComponent";
import { FiSend } from "react-icons/fi";
import AgreeFaceChatModal from "../../components/room/AgreeFaceChatModal";

// 환경에 따라 서버 URL 설정
const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5000/";

const Room: React.FC = () => {
  // modal창 상태 변수
  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // 상태 변수 설정
  const [mode, setMode] = useState<String>("chat");
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
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [newMessage, setNewMessage] = useState<string>("");
  const currentVideoDevice = useRef<Device | undefined>();

  // 페이지를 떠날 때 세션 종료
  useEffect(() => {
    const handleBeforeUnload = () => leaveSession();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [session]);

  // 세션 ID 변경
  const handleChangeSessionId = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMySessionId(e.target.value);

  // 사용자 이름 변경
  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMyUserName(e.target.value);

  // 메인 비디오 스트림 설정
  const handleMainVideoStream = (stream: StreamManager) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  // 구독자 삭제
  const deleteSubscriber = (streamManager: StreamManager) => {
    if (subscriber === streamManager) {
      setSubscriber(undefined);
    }
  };

  // 세션 참가
  const joinSession = async (e: FormEvent) => {
    e.preventDefault();
    const OV = new OpenVidu();
    const session = OV.initSession();

    // 스트림 생성 이벤트 처리
    session.on("streamCreated", (event) => {
      const newSubscriber = session.subscribe(event.stream, undefined);
      setSubscriber(newSubscriber);
    });

    // 스트림 종료 이벤트 처리
    session.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    // 예외 처리
    session.on("exception", (exception) => {
      console.warn(exception);
    });

    // 채팅 신호 수신
    session.on("signal:chat", (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSession(session);

    // 토큰 생성 및 세션 연결
    const token = await getToken();
    session
      .connect(token, { clientData: myUserName })
      .then(async () => {
        const publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: false,
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
      })
      .catch((error) => {
        console.error(
          "There was an error connecting to the session:",
          error.code,
          error.message
        );
      });
  };

  // 세션 떠나기
  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(undefined);
    setSubscriber(undefined);
    setMySessionId("SessionA");
    setMyUserName("Participant" + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  // 메시지 전송
  const sendMessage = () => {
    if (session && newMessage.trim()) {
      session.signal({
        data: JSON.stringify({ user: myUserName, text: newMessage }),
        to: [],
        type: "chat",
      });
      setNewMessage("");
    }
  };

  // 토큰 얻기
  const getToken = async (): Promise<string> => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  // 세션 생성
  const createSession = async (sessionId: string): Promise<string> => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions",
      { customSessionId: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The sessionId
  };

  // 토큰 생성
  const createToken = async (sessionId: string): Promise<string> => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The token
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-main-bg bg-cover bg-center"></div>
      <div className="absolute inset-0 -z-10 bg-black opacity-40"></div>
      {/* 세션에 참가하지 않은 경우 */}
      {session === undefined ? (
        <div
          id="join"
          className="flex h-screen flex-col items-center justify-center"
        >
          <div
            id="join-dialog"
            className="jumbotron rounded-lg bg-white p-6 shadow-lg"
          >
            <h1 className="text-center text-2xl font-bold text-gray-700">
              Join a video session
            </h1>
            <form className="form-group mt-4" onSubmit={joinSession}>
              <p>
                <label className="text-teal-600">Participant: </label>
                <input
                  className="form-control mt-1 w-full rounded border border-gray-300 px-3 py-2 font-bold text-teal-600 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  type="text"
                  id="userName"
                  value={myUserName}
                  onChange={handleChangeUserName}
                  required
                />
              </p>
              <p className="mt-4">
                <label className="text-teal-600">Session: </label>
                <input
                  className="form-control mt-1 w-full rounded border border-gray-300 px-3 py-2 font-bold text-teal-600 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  type="text"
                  id="sessionId"
                  value={mySessionId}
                  onChange={handleChangeSessionId}
                  required
                />
              </p>
              <p className="mt-6 text-center">
                <input
                  className="btn btn-lg rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-400"
                  name="commit"
                  type="submit"
                  value="JOIN"
                />
              </p>
            </form>
          </div>
        </div>
      ) : null}

      {/* 세션에 참가한 경우 */}
      {session !== undefined ? (
        <div
          id="session"
          className={`${mode == "chat" ? "justify-end" : "justify-center"} flex h-screen p-4`}
        >
          {mainStreamManager !== undefined ? (
            <div
              id="main-video"
              className={`${mode == "chat" ? "hidden" : ""} absolute left-0 top-0 w-72 bg-white`}
            >
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : null}
          <div
            className={`${mode == "chat" ? "hidden" : ""} flex w-3/5 items-center justify-center bg-violet-400`}
          >
            <div className=""> 게임이 들어갈 화면입니다.</div>
          </div>
          <div
            id="video-container"
            className={`${mode == "chat" ? "hidden" : ""}`}
          >
            {subscriber ? (
              <div
                className="stream-container absolute bottom-0 right-0 w-72 bg-white"
                onClick={() => handleMainVideoStream(subscriber)}
              >
                <span>{subscriber.stream.connection.data}</span>
                <UserVideoComponent streamManager={subscriber} />
              </div>
            ) : null}
          </div>
          {/* 채팅 */}
          <button
            onClick={openModal}
            className={`${mode == "chat" ? "" : "hidden"} rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700`}
          >
            Open Face Chat Agreement
          </button>

          <AgreeFaceChatModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Agree to Face Chat"
            footer={
              <div className="mx-auto flex w-1/2 justify-between">
                <button
                  onClick={() => {
                    closeModal();
                    setMode("faceChat");
                  }}
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                >
                  진행
                </button>
                <button
                  onClick={leaveSession}
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                >
                  거부
                </button>
              </div>
            }
          >
            <p>상대방과 화상채팅을 진행하시겠습니까?</p>
          </AgreeFaceChatModal>
          <div
            className={`${mode == "chat" ? "" : "hidden"} w-96 flex-col rounded-2xl`}
          >
            <header className="bg-chatRoom-high h-14 rounded-t-2xl bg-custom-purple-color"></header>
            <div className="h-5/6 overflow-y-auto border border-gray-300 bg-chatRoom-color p-2">
              {messages.map((msg, i) => (
                <div key={i} className="mb-1">
                  <strong>{msg.user}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="flex items-center rounded-b-2xl bg-custom-purple-color p-4">
              <input
                type="text"
                className="flex-grow rounded-lg bg-chatRoom-color p-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
              />
              <FiSend
                className="ml-4 cursor-pointer text-2xl text-white"
                onClick={sendMessage}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Room;
