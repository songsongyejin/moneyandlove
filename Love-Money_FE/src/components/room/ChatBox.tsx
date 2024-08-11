import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import aiBot from "../../assets/ai_bot.gif";
import "./chatBox.css";
import * as faceapi from "face-api.js";
import { useRecoilState } from "recoil";
import { maxExpressionState, warning } from "../../atom/store";

// 채팅 박스 컴포넌트
const ChatBox = ({
  mode,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  myUserName,
}: {
  mode: string; // 모드 상태 변수 (채팅 또는 화상 채팅)
  messages: { user: string; text: string; Emoji: string }[]; // 메시지 상태 변수
  newMessage: string; // 새 메시지 상태 변수
  setNewMessage: React.Dispatch<React.SetStateAction<string>>; // 새 메시지 변경 핸들러
  sendMessage: () => void; // 메시지 전송 함수
  myUserName: string; // 현재 사용자 이름
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const [maxExpression, setMaxExpression] = useRecoilState(maxExpressionState);
  const [warningMsg, setWarningMsg] = useRecoilState(warning);

  // Face API
  const videoRef = useRef<HTMLVideoElement>(null); // 비디오 요소에 대한 참조를 저장합니다.
  const lastDetectedTime = useRef<number | null>(null); // 마지막으로 얼굴이 감지된 시간을 저장합니다.

  useEffect(() => {
    // 모델을 로드하는 비동기 함수입니다.
    const loadModels = async () => {
      const MODEL_URL = "/models"; // 모델 파일들이 위치한 경로

      // Face API 모델을 로드합니다.
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      // 모델이 로드되면 비디오 스트림을 시작합니다.
      startVideo();
    };

    // 웹캠 스트림을 시작하는 함수입니다.
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          // videoRef가 현재 참조하는 비디오 요소에 스트림을 할당합니다.
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // 비디오가 로드된 후 analyzeExpressions를 호출
            videoRef.current.addEventListener("loadedmetadata", () => {
              analyzeExpressions();
            });
          }
        })
        .catch((err) => console.error("Error accessing webcam: ", err));
    };

    // 모델 로드 함수 호출
    loadModels();
  }, []);

  const analyzeExpressions = async () => {
    if (videoRef.current) {
      const displaySize = {
        width: videoRef.current.width,
        height: videoRef.current.height,
      };

      // 비디오 요소의 크기를 맞추기 위해 매칭합니다.
      faceapi.matchDimensions(videoRef.current, displaySize);

      // 100ms마다 얼굴을 감지하고 표정을 분석하는 타이머를 설정합니다.
      const interval = setInterval(async () => {
        if (videoRef.current) {
          const detections = await faceapi
            .detectAllFaces(
              videoRef.current!,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceExpressions();

          if (detections.length > 0) {
            // 얼굴이 인식된 경우
            lastDetectedTime.current = Date.now(); // 현재 시간을 저장
            setWarningMsg(""); // 경고 메시지 제거

            // 가장 강한 표정을 찾고 상태를 업데이트합니다.
            const exp = detections[0].expressions;
            const maxExp = Object.keys(exp).reduce((a, b) =>
              exp[a] > exp[b] ? a : b
            );
            setMaxExpression(maxExp);
          } else if (
            lastDetectedTime.current &&
            Date.now() - lastDetectedTime.current > 1000
          ) {
            // 1초 동안 얼굴이 감지되지 않은 경우
            setWarningMsg(
              "얼굴 인식이 되지 않았습니다. \n정면을 응시해주세요!!! \n표정이 인식되면 채팅장이 공개됩니다!!!"
            );
          }
        }
      }, 100); // 100ms마다 실행

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }
  };

  return (
    <div className="absolute h-screen w-screen">
      {/* 비디오 요소는 화면에 표시되지 않지만 표정을 분석하는 데 사용됩니다. */}
      <video ref={videoRef} autoPlay muted width="0" height="0" />

      {/* 감지된 가장 강한 표정만 화면에 표시합니다. */}
      {maxExpression && (
        <div className="absolute left-5 top-5 rounded-md bg-white p-2 shadow-md">
          <h3 className="text-lg font-bold">Max Expression: {maxExpression}</h3>
        </div>
      )}

      {/* 경고 메시지를 화면에 표시 */}
      {warningMsg && (
        <div className="absolute bottom-5 left-5 rounded-md bg-red-500 p-2 text-white shadow-md">
          <h3 className="text-lg font-bold">{warningMsg}</h3>
        </div>
      )}

      <img src={aiBot} alt="" className="absolute bottom-5 left-5 w-24" />
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
                  key={i}
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
                            <strong></strong> {msg.text}
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
