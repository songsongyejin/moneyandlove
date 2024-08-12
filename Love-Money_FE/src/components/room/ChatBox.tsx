import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiSend } from "react-icons/fi";
import aiBot from "../../assets/ai_bot.gif";
import "./chatBox.css";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { useRecoilState } from "recoil";
import { maxExpressionState, warning } from "../../atom/store";

const ChatBox = ({
  mode,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  myUserName,
}: {
  mode: string;
  messages: { user: string; text: string; Emoji: string }[];
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  myUserName: string;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const webcamRef = useRef<Webcam>(null);
  const [maxExpression, setMaxExpression] = useRecoilState(maxExpressionState);
  const [warningMsg, setWarningMsg] = useRecoilState(warning);
  const [loading, setLoading] = useState(true); // 모델 로딩 상태 추가

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      setLoading(true);
      console.log("모델 로딩 시작!!!");
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => {
        console.log("모델 로딩 완료!");
      });
      setLoading(false);
    };

    loadModels();
  }, []);

  const analyzeEmotion = async () => {
    if (webcamRef.current && webcamRef.current.video) {
      const video = webcamRef.current.video;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detection) {
        const expressions = detection.expressions;
        const maxEmotion = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );
        setMaxExpression(maxEmotion);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      analyzeEmotion();
    }, 100); // 1초마다 감정 분석
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute h-screen w-screen">
      {loading ? (
        <p>Loading models...</p>
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 160,
            height: 120,
            facingMode: "user",
          }}
          className="absolute"
        />
      )}

      {maxExpression && (
        <div className="absolute left-5 top-5 rounded-md bg-white p-2 shadow-md">
          <h3 className="text-lg font-bold">Max Expression: {maxExpression}</h3>
        </div>
      )}

      {warningMsg && (
        <div className="absolute bottom-5 left-5 rounded-md bg-red-500 p-2 text-white shadow-md">
          <h3 className="text-lg font-bold">{warningMsg}</h3>
        </div>
      )}

      <img src={aiBot} alt="AI Bot" className="absolute bottom-5 left-5 w-24" />
      <div className="absolute bottom-20 left-28 rounded-e-2xl rounded-tl-2xl border-4 border-solid border-custom-purple-color bg-white p-3 text-lg font-semibold text-custom-purple-color">
        자신이 러브헌터임을 어필해주세요!
      </div>

      <div className="h-full">
        <div
          style={{ fontFamily: "DungGeunMo" }}
          className={`${mode === "chat" ? "" : "hidden"} mx-auto h-full w-[600px] flex-col items-center rounded-2xl pt-5`}
        >
          <div className="h-5/6 overflow-y-auto border border-gray-300 bg-transparent p-2">
            {messages.map((msg, i) => {
              const isMyMessage = msg.user === myUserName;
              return (
                <div
                  key={`${msg.user}-${i}`}
                  className={`mb-3 flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                >
                  {isMyMessage ? (
                    <>
                      <div className="speech-bubble2 mr-2 p-2">{msg.text}</div>
                      <p className="my-auto text-2xl">{msg.Emoji}</p>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="ml-10 text-sm"> {msg.user}</p>
                        <div className="flex">
                          <p className="my-auto text-2xl">{msg.Emoji}</p>
                          <div className="speech-bubble ml-2 p-2">
                            <strong>{msg.user}</strong> {msg.text}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center rounded-b-2xl bg-chat-color p-4">
            <input
              type="text"
              className="flex-grow rounded-s-lg p-2 focus:outline-custom-purple-color"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요"
            />
            <div className="rounded-e-lg bg-custom-purple-color p-2 px-4">
              <FiSend
                className="cursor-pointer text-2xl text-white"
                onClick={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
