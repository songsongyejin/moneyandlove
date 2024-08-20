import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import "./chatBox.css";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { useRecoilState } from "recoil";
import { maxExpressionState } from "../../atom/store";
import boy_neutral from "../../assets/boy_neutral.png";
import boy_angry from "../../assets/boy_angry.png";
import boy_disgusted from "../../assets/boy_disgusted.png";
import boy_fearful from "../../assets/boy_fearful.png";
import boy_happy from "../../assets/boy_happy.png";
import boy_sad from "../../assets/boy_sad.png";
import boy_surprised from "../../assets/boy_surprised.png";
import girl_neutral from "../../assets/girl_neutral.png";
import girl_angry from "../../assets/girl_angry.png";
import girl_disgusted from "../../assets/girl_disgusted.png";
import girl_fearful from "../../assets/girl_fearful.png";
import girl_happy from "../../assets/girl_happy.png";
import girl_sad from "../../assets/girl_sad.png";
import girl_surprised from "../../assets/girl_surprised.png";

import ai_face from "../../assets/ai_face.gif";

const ChatBox = ({
  mode,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  myUserName,
  matchData,
}: {
  mode: string;
  messages: { user: string; text: string; Emoji: string }[];
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  myUserName: string;
  matchData: any;
}) => {
  const webcamRef = useRef<Webcam>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [maxExpression, setMaxExpression] = useRecoilState(maxExpressionState);
  const [warningMsg, setWarningMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [noFaceDetectedCount, setNoFaceDetectedCount] = useState(0);
  const [myGender, setMyGender] = useState<"boy" | "girl">("boy"); // 기본값 설정

  useEffect(() => {
    if (matchData) {
      if (matchData.fromUser.gender === "MALE") {
        setMyGender("boy");
      } else if (matchData.fromUser.gender === "FEMALE") {
        setMyGender("girl");
      }
    }
  }, [matchData]);

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

        // 얼굴이 감지되면 경고 메시지 제거
        setNoFaceDetectedCount(0);
        setWarningMsg("");
      } else {
        // 얼굴이 감지되지 않으면 카운트를 증가
        setNoFaceDetectedCount((prevCount) => prevCount + 1);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      analyzeEmotion();
    }, 100); // 0.1초마다 감정 분석
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (noFaceDetectedCount > 10) {
      // 10번 연속으로 얼굴이 감지되지 않으면 경고 메시지 표시
      setWarningMsg(
        "얼굴이 감지되지 않았습니다. 카메라 앞에 얼굴을 위치시켜 주세요."
      );
    }
  }, [noFaceDetectedCount]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 감정에 따라 boy 이미지 매핑
  const images = {
    boy: {
      happy: boy_happy,
      sad: boy_sad,
      angry: boy_angry,
      surprised: boy_surprised,
      disgusted: boy_disgusted,
      fearful: boy_fearful,
      neutral: boy_neutral,
    },
    girl: {
      happy: girl_happy,
      sad: girl_sad,
      angry: girl_angry,
      surprised: girl_surprised,
      disgusted: girl_disgusted,
      fearful: girl_fearful,
      neutral: girl_neutral,
    },
  } as const; // 객체를 as const로 선언
  const getOppositeGenderImage = (gender: "boy" | "girl") => {
    return gender === "boy" ? girl_happy : boy_happy;
  };
  const getImageForExpression = (
    expression: keyof typeof images.boy,
    gender: keyof typeof images
  ) => {
    return images[gender][expression];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // 안전한 maxExpression 타입 검사를 위해 validExpressions 사용
  const validExpressions: (keyof typeof images.boy)[] = [
    "happy",
    "sad",
    "angry",
    "surprised",
    "disgusted",
    "fearful",
    "neutral",
  ];

  const expression: keyof typeof images.boy = validExpressions.includes(
    maxExpression as keyof typeof images.boy
  )
    ? (maxExpression as keyof typeof images.boy)
    : "neutral";

  return (
    <div className="absolute h-screen w-screen">
      {warningMsg && (
        <div className="absolute z-50 mx-auto flex h-5/6 w-full flex-col justify-center whitespace-pre-line rounded bg-red-500 text-center text-white">
          <div className="bg-white">
            <img src={ai_face} alt="" className="mx-auto h-44" />
          </div>
          <p style={{ fontFamily: "DungGeunMo" }} className="block">
            {warningMsg}
          </p>
        </div>
      )}
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
          className="absolute -z-50"
        />
      )}

      <div className="h-full">
        <div
          style={{ fontFamily: "DungGeunMo" }}
          className={`${
            mode === "chat" ? "" : "hidden"
          } mx-auto h-full w-[800px] flex-col items-center rounded-2xl pt-5`}
        >
          <div className="scrollbar h-[600px] overflow-y-auto bg-transparent p-2">
            {messages.map((msg, i) => {
              const isMyMessage = msg.user === myUserName;
              return (
                <div
                  key={`${msg.user}-${i}`}
                  className={`mb-3 flex ${
                    isMyMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  {isMyMessage ? (
                    <>
                      <div className="speech-bubble2 mr-2 flex items-center p-2">
                        {msg.text}
                      </div>
                      <p className="my-auto text-6xl">{msg.Emoji}</p>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="ml-10 text-white"> {msg.user}</p>
                        <div className="flex">
                          <p className="my-auto text-6xl">{msg.Emoji}</p>
                          <div className="speech-bubble ml-2 flex items-center p-2">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} /> {/* 스크롤 위치 참조점 */}
          </div>
          <div className="fixed bottom-0 flex w-[800px] justify-between">
            <img
              src={getOppositeGenderImage(myGender)}
              alt=""
              className="w-32"
            />
            <div className="mx-8 mt-10 flex w-full items-center bg-transparent">
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
            <img
              src={getImageForExpression(expression, myGender)}
              alt="Emotion"
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
