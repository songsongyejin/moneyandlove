import React, { useState, useEffect, useRef, FormEvent } from "react";
import {
  OpenVidu,
  Session,
  Publisher,
  StreamManager,
  Device,
} from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";

const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5000/";

const Room: React.FC = () => {
  const [mySessionId, setMySessionId] = useState<string>("SessionA");
  const [myUserName, setMyUserName] = useState<string>(
    "Participant" + Math.floor(Math.random() * 100)
  );
  const [session, setSession] = useState<Session | undefined>();
  const [mainStreamManager, setMainStreamManager] = useState<
    StreamManager | undefined
  >();
  const [publisher, setPublisher] = useState<Publisher | undefined>();
  const [subscribers, setSubscribers] = useState<StreamManager[]>([]);
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [newMessage, setNewMessage] = useState<string>("");
  const currentVideoDevice = useRef<Device | undefined>();

  useEffect(() => {
    const handleBeforeUnload = () => leaveSession();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [session]);

  const handleChangeSessionId = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMySessionId(e.target.value);
  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMyUserName(e.target.value);

  const handleMainVideoStream = (stream: StreamManager) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const deleteSubscriber = (streamManager: StreamManager) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((sub) => sub !== streamManager)
    );
  };

  const joinSession = async (e: FormEvent) => {
    e.preventDefault();
    const OV = new OpenVidu();
    const session = OV.initSession();

    session.on("streamCreated", (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    session.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    session.on("exception", (exception) => {
      console.warn(exception);
    });

    session.on("signal:chat", (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSession(session);

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

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("SessionA");
    setMyUserName("Participant" + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

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

  const getToken = async (): Promise<string> => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

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
      {session === undefined ? (
        <div
          id="join"
          className="flex h-screen flex-col items-center justify-center"
        >
          <div id="img-div" className="text-center">
            <img
              src="resources/images/openvidu_grey_bg_transp_cropped.png"
              alt="OpenVidu logo"
              className="mx-auto h-20 w-1/3"
            />
          </div>
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

      {session !== undefined ? (
        <div id="session" className="flex h-screen justify-center p-4">
          {mainStreamManager !== undefined ? (
            <div
              id="main-video"
              className="absolute left-0 top-0 w-72 bg-white"
            >
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : null}
          <div className="flex w-3/5 items-center justify-center bg-violet-400">
            <div className=""> 게임이 들어갈 화면입니다.</div>
          </div>
          <div id="video-container" className="bottom-0 flex">
            {subscribers.map((sub, i) => (
              <div
                key={i}
                className="stream-container absolute bottom-0 right-0 w-72 bg-white"
                onClick={() => handleMainVideoStream(sub)}
              >
                <span>{sub.stream.connection.data}</span>
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}
          </div>
          <div className="left-2/5 absolute bottom-0 w-3/5 bg-white p-4">
            <div className="mb-2 h-64 overflow-y-auto border border-gray-300 p-2">
              {messages.map((msg, i) => (
                <div key={i} className="mb-1">
                  <strong>{msg.user}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-grow border border-gray-300 p-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
              />
              <button
                className="ml-2 bg-blue-500 px-4 py-2 text-white"
                onClick={sendMessage}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Room;
