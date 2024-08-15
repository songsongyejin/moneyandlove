import React, { useState, useEffect, useRef } from "react";
import BaseModal from "../home/BaseModal";
import BiggerModal from "../home/BiggerModal";
import * as tmImage from "@teachablemachine/image";
import * as tf from "@tensorflow/tfjs"; // 명시적으로 tfjs를 import
import * as faceapi from "face-api.js";
import { userInfo } from "../../atom/store";
import { useRecoilState } from "recoil";
import { userToken } from "../../atom/store";
import { useRecoilValue } from "recoil";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse, AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";
import "./matching.css";
import heart from "../../assets/start_heart_icon.svg";
import { useNavigate } from "react-router-dom";
import { updateFaceScore } from "../../utils/faceScore";

const APPLICATION_SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface FaceVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void; // 인증 완료 시 호출할 함수
}

const FaceVerification: React.FC<FaceVerificationProps> = ({
  isOpen,
  onClose,
  onComplete, // 인증 완료 시 호출할 콜백 함수
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null); // 추출된 얼굴 이미지를 저장할 상태
  const [emojiMosaic, setEmojiMosaic] = useState<string | null>(null); // 이모티콘 모자이크 이미지를 저장할 상태
  const [finalScore, setFinalScore] = useState<number | null>(null); // 종합 점수를 저장할 상태
  const [model, setModel] = useState<any>(null);
  const [user] = useRecoilState(userInfo);
  const token = useRecoilValue(userToken);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      initModel();
      loadFaceApiModels();
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen]);

  const resetState = async () => {
    setImagePreview(null);
    setFacePreview(null);
    setEmojiMosaic(null);
    setFinalScore(null);
    await stopCamera();
    onClose();
  };

  const loadFaceApiModels = async () => {
    // face-api.js 모델 로드
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models"); // face detection model
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models"); // landmark model
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models"); // face recognition model
  };

  const initModel = async () => {
    if (!user) {
      console.error("User is not defined.");
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    let baseURL = "./";

    if (user.gender === "MALE") {
      baseURL += "male/";
    } else if (user.gender === "FEMALE") {
      baseURL += "female/";
    } else {
      console.error(
        "Unknown gender or gender is not set. Defaulting to female model."
      );
      baseURL += "female/"; // 기본값으로 female 설정
    }

    const modelURL = baseURL + "model.json";
    const metadataURL = baseURL + "metadata.json";

    try {
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);

      console.log("모델이 성공적으로 로드되었습니다.");
    } catch (error) {
      console.error("모델을 로드하는 중 오류가 발생했습니다.", error);
      alert(
        "모델을 로드하는 중 오류가 발생했습니다. model.json과 model.weights.bin 파일이 올바르게 위치해 있는지 확인하세요."
      );
    }
  };

  const startCamera = async () => {
    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const stopCamera = async () => {
    console.log("Attempting to stop camera");
    console.log("videoRef.current:", videoRef.current);
    console.log("videoRef.current?.srcObject:", videoRef.current?.srcObject);

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        console.log("Stopping track:", track); // 각 트랙을 중지할 때 로그 추가
        track.stop();
      });
      videoRef.current.srcObject = null;
      console.log("카메라 닫힘");
    } else {
      console.log("비디오 참조 또는 srcObject가 없습니다.");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const imageDataUrl = canvasRef.current.toDataURL("image/png");
        setImagePreview(imageDataUrl);
        processImage(imageDataUrl);
      }
    }
  };

  const processImage = async (imageDataUrl: string) => {
    setLoading(true);
    setTimeout(async () => {
      const imgElement = new Image();
      imgElement.src = imageDataUrl;
      imgElement.onload = async () => {
        if (model) {
          const faceDetection = await faceapi.detectSingleFace(imgElement);

          if (faceDetection) {
            // Adjust the box to include more of the head (top) and neck (bottom)
            const box = faceDetection.box;
            const paddingTop = box.height * 0.3; // 30% of the detected height added to the top
            const paddingBottom = box.height * 0.2; // 20% of the detected height added to the bottom
            const paddingSides = box.width * 0.3; // 30% of the detected width added to both sides

            const newX = Math.max(box.x - paddingSides, 0);
            const newY = Math.max(box.y - paddingTop, 0);
            const newWidth = Math.min(
              box.width + 2 * paddingSides,
              imgElement.width - newX
            );
            const newHeight = Math.min(
              box.height + paddingTop + paddingBottom,
              imgElement.height - newY
            );

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (ctx) {
              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx.drawImage(
                imgElement,
                newX,
                newY,
                newWidth,
                newHeight,
                0,
                0,
                newWidth,
                newHeight
              );

              const faceDataUrl = canvas.toDataURL();
              setFacePreview(faceDataUrl); // 추출한 얼굴 이미지를 저장

              createEmojiMosaic(faceDataUrl); // 이모티콘 모자이크 생성

              const faceImg = new Image();
              faceImg.src = faceDataUrl;
              faceImg.onload = async () => {
                tf.tidy(() => {
                  model.predict(faceImg).then((prediction: any) => {
                    const finalScore = calculateFinalScore(prediction);
                    setFinalScore(finalScore);
                    setLoading(false);
                  });
                });
              };
            }
          } else {
            alert("얼굴을 감지하지 못했습니다. 다시 시도해 주세요.");
            setLoading(false);
          }
        } else {
          console.error("Model not loaded");
          setLoading(false);
        }
      };
    }, 100); // Delay to ensure the img element is rendered
  };

  const createEmojiMosaic = async (imageDataUrl: string) => {
    const hiddenCanvas = hiddenCanvasRef.current;
    if (!hiddenCanvas) return;

    const img = new Image();
    img.src = imageDataUrl;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const hiddenCtx = hiddenCanvas.getContext("2d");
      if (!hiddenCtx) return;

      hiddenCanvas.width = img.width;
      hiddenCanvas.height = img.height;
      hiddenCtx.drawImage(img, 0, 0);

      const pSize = 7; // 모자이크 타일 크기 (Analysis Window)
      const scale = 8; // 이모티콘 크기 (Output emoji size)
      const matchTolerance = 7; // Match Tolerance
      const allowedEmptySpace = 60; // Allowed Empty Space
      const rows = Math.floor(img.height / pSize);
      const cols = Math.floor(img.width / pSize);

      const resultCanvas = document.createElement("canvas");
      resultCanvas.width = img.width;
      resultCanvas.height = img.height;
      const resultCtx = resultCanvas.getContext("2d");

      if (resultCtx) {
        const sourceEmojis =
          "🧑🏻‍❤️‍💋‍🧑🏼,🧑🏻‍❤️‍💋‍🧑🏽,🧑🏻‍❤️‍💋‍🧑🏾,🧑🏻‍❤️‍💋‍🧑🏿,🧑🏼‍❤️‍💋‍🧑🏻,🧑🏼‍❤️‍💋‍🧑🏽,🧑🏼‍❤️‍💋‍🧑🏾,🧑🏼‍❤️‍💋‍🧑🏿,🧑🏽‍❤️‍💋‍🧑🏻,🧑🏽‍❤️‍💋‍🧑🏼,🧑🏽‍❤️‍💋‍🧑🏾,🧑🏽‍❤️‍💋‍🧑🏿,🧑🏾‍❤️‍💋‍🧑🏻,🧑🏾‍❤️‍💋‍🧑🏼,🧑🏾‍❤️‍💋‍🧑🏽,🧑🏾‍❤️‍💋‍🧑🏿,🧑🏿‍❤️‍💋‍🧑🏻,🧑🏿‍❤️‍💋‍🧑🏼,🧑🏿‍❤️‍💋‍🧑🏽,🧑🏿‍❤️‍💋‍🧑🏾,👩🏻‍❤️‍💋‍👨🏻,👩🏻‍❤️‍💋‍👨🏼,👩🏻‍❤️‍💋‍👨🏽,👩🏻‍❤️‍💋‍👨🏾,👩🏻‍❤️‍💋‍👨🏿,👩🏼‍❤️‍💋‍👨🏻,👩🏼‍❤️‍💋‍👨🏼,👩🏼‍❤️‍💋‍👨🏽,👩🏼‍❤️‍💋‍👨🏾,👩🏼‍❤️‍💋‍👨🏿,👩🏽‍❤️‍💋‍👨🏻,👩🏽‍❤️‍💋‍👨🏼,👩🏽‍❤️‍💋‍👨🏽,👩🏽‍❤️‍💋‍👨🏾,👩🏽‍❤️‍💋‍👨🏿,👩🏾‍❤️‍💋‍👨🏻,👩🏾‍❤️‍💋‍👨🏼,👩🏾‍❤️‍💋‍👨🏽,👩🏾‍❤️‍💋‍👨🏾,👩🏾‍❤️‍💋‍👨🏿,👩🏿‍❤️‍💋‍👨🏻,👩🏿‍❤️‍💋‍👨🏼,👩🏿‍❤️‍💋‍👨🏽,👩🏿‍❤️‍💋‍👨🏾,👩🏿‍❤️‍💋‍👨🏿,👨🏻‍❤️‍💋‍👨🏻,👨🏻‍❤️‍💋‍👨🏼,👨🏻‍❤️‍💋‍👨🏽,👨🏻‍❤️‍💋‍👨🏾,👨🏻‍❤️‍💋‍👨🏿,👨🏼‍❤️‍💋‍👨🏻,👨🏼‍❤️‍💋‍👨🏼,👨🏼‍❤️‍💋‍👨🏽,👨🏼‍❤️‍💋‍👨🏾,👨🏼‍❤️‍💋‍👨🏿,👨🏽‍❤️‍💋‍👨🏻,👨🏽‍❤️‍💋‍👨🏼,👨🏽‍❤️‍💋‍👨🏽,👨🏽‍❤️‍💋‍👨🏾,👨🏽‍❤️‍💋‍👨🏿,👨🏾‍❤️‍💋‍👨🏻,👨🏾‍❤️‍💋‍👨🏼,👨🏾‍❤️‍💋‍👨🏽,👨🏾‍❤️‍💋‍👨🏾,👨🏾‍❤️‍💋‍👨🏿,👨🏿‍❤️‍💋‍👨🏻,👨🏿‍❤️‍💋‍👨🏼,👨🏿‍❤️‍💋‍👨🏽,👨🏿‍❤️‍💋‍👨🏾,👨🏿‍❤️‍💋‍👨🏿,👩🏻‍❤️‍💋‍👩🏻,👩🏻‍❤️‍💋‍👩🏼,👩🏻‍❤️‍💋‍👩🏽,👩🏻‍❤️‍💋‍👩🏾,👩🏻‍❤️‍💋‍👩🏿,👩🏼‍❤️‍💋‍👩🏻,👩🏼‍❤️‍💋‍👩🏼,👩🏼‍❤️‍💋‍👩🏽,👩🏼‍❤️‍💋‍👩🏾,👩🏼‍❤️‍💋‍👩🏿,👩🏽‍❤️‍💋‍👩🏻,👩🏽‍❤️‍💋‍👩🏼,👩🏽‍❤️‍💋‍👩🏽,👩🏽‍❤️‍💋‍👩🏾,👩🏽‍❤️‍💋‍👩🏿,👩🏾‍❤️‍💋‍👩🏻,👩🏾‍❤️‍💋‍👩🏼,👩🏾‍❤️‍💋‍👩🏽,👩🏾‍❤️‍💋‍👩🏾,👩🏾‍❤️‍💋‍👩🏿,👩🏿‍❤️‍💋‍👩🏻,👩🏿‍❤️‍💋‍👩🏼,👩🏿‍❤️‍💋‍👩🏽,👩🏿‍❤️‍💋‍👩🏾,👩🏿‍❤️‍💋‍👩🏿,🏴󠁧󠁢󠁥󠁮󠁧󠁿,🏴󠁧󠁢󠁳󠁣󠁴󠁿,🏴󠁧󠁢󠁷󠁬󠁳󠁿,🧑🏻‍🤝‍🧑🏻,🧑🏻‍🤝‍🧑🏼,🧑🏻‍🤝‍🧑🏽,🧑🏻‍🤝‍🧑🏾,🧑🏻‍🤝‍🧑🏿,🧑🏼‍🤝‍🧑🏻,🧑🏼‍🤝‍🧑🏼,🧑🏼‍🤝‍🧑🏽,🧑🏼‍🤝‍🧑🏾,🧑🏼‍🤝‍🧑🏿,🧑🏽‍🤝‍🧑🏻,🧑🏽‍🤝‍🧑🏼,🧑🏽‍🤝‍🧑🏽,🧑🏽‍🤝‍🧑🏾,🧑🏽‍🤝‍🧑🏿,🧑🏾‍🤝‍🧑🏻,🧑🏾‍🤝‍🧑🏼,🧑🏾‍🤝‍🧑🏽,🧑🏾‍🤝‍🧑🏾,🧑🏾‍🤝‍🧑🏿,🧑🏿‍🤝‍🧑🏻,🧑🏿‍🤝‍🧑🏼,🧑🏿‍🤝‍🧑🏽,🧑🏿‍🤝‍🧑🏾,🧑🏿‍🤝‍🧑🏿,👩🏻‍🤝‍👩🏼,👩🏻‍🤝‍👩🏽,👩🏻‍🤝‍👩🏾,👩🏻‍🤝‍👩🏿,👩🏼‍🤝‍👩🏻,👩🏼‍🤝‍👩🏽,👩🏼‍🤝‍👩🏾,👩🏼‍🤝‍👩🏿,👩🏽‍🤝‍👩🏻,👩🏽‍🤝‍👩🏼,👩🏽‍🤝‍👩🏾,👩🏽‍🤝‍👩🏿,👩🏾‍🤝‍👩🏻,👩🏾‍🤝‍👩🏼,👩🏾‍🤝‍👩🏽,👩🏾‍🤝‍👩🏿,👩🏿‍🤝‍👩🏻,👩🏿‍🤝‍👩🏼,👩🏿‍🤝‍👩🏽,👩🏿‍🤝‍👩🏾,👩🏻‍🤝‍👨🏼,👩🏻‍🤝‍👨🏽,👩🏻‍🤝‍👨🏾,👩🏻‍🤝‍👨🏿,👩🏼‍🤝‍👨🏻,👩🏼‍🤝‍👨🏽,👩🏼‍🤝‍👨🏾,👩🏼‍🤝‍👨🏿,👩🏽‍🤝‍👨🏻,👩🏽‍🤝‍👨🏼,👩🏽‍🤝‍👨🏾,👩🏽‍🤝‍👨🏿,👩🏾‍🤝‍👨🏻,👩🏾‍🤝‍👨🏼,👩🏾‍🤝‍👨🏽,👩🏾‍🤝‍👨🏿,👩🏿‍🤝‍👨🏻,👩🏿‍🤝‍👨🏼,👩🏿‍🤝‍👨🏽,👩🏿‍🤝‍👨🏾,👨🏻‍🤝‍👨🏼,👨🏻‍🤝‍👨🏽,👨🏻‍🤝‍👨🏾,👨🏻‍🤝‍👨🏿,👨🏼‍🤝‍👨🏻,👨🏼‍🤝‍👨🏽,👨🏼‍🤝‍👨🏾,👨🏼‍🤝‍👨🏿,👨🏽‍🤝‍👨🏻,👨🏽‍🤝‍👨🏼,👨🏽‍🤝‍👨🏾,👨🏽‍🤝‍👨🏿,👨🏾‍🤝‍👨🏻,👨🏾‍🤝‍👨🏼,👨🏾‍🤝‍👨🏽,👨🏾‍🤝‍👨🏿,👨🏿‍🤝‍👨🏻,👨🏿‍🤝‍👨🏼,👨🏿‍🤝‍👨🏽,👨🏿‍🤝‍👨🏾,🧑🏻‍❤️‍🧑🏼,🧑🏻‍❤️‍🧑🏽,🧑🏻‍❤️‍🧑🏾,🧑🏻‍❤️‍🧑🏿,🧑🏼‍❤️‍🧑🏻,🧑🏼‍❤️‍🧑🏽,🧑🏼‍❤️‍🧑🏾,🧑🏼‍❤️‍🧑🏿,🧑🏽‍❤️‍🧑🏻,🧑🏽‍❤️‍🧑🏼,🧑🏽‍❤️‍🧑🏾,🧑🏽‍❤️‍🧑🏿,🧑🏾‍❤️‍🧑🏻,🧑🏾‍❤️‍🧑🏼,🧑🏾‍❤️‍🧑🏽,🧑🏾‍❤️‍🧑🏿,🧑🏿‍❤️‍🧑🏻,🧑🏿‍❤️‍🧑🏼,🧑🏿‍❤️‍🧑🏽,🧑🏿‍❤️‍🧑🏾,👩🏻‍❤️‍👨🏻,👩🏻‍❤️‍👨🏼,👩🏻‍❤️‍👨🏽,👩🏻‍❤️‍👨🏾,👩🏻‍❤️‍👨🏿,👩🏼‍❤️‍👨🏻,👩🏼‍❤️‍👨🏼,👩🏼‍❤️‍👨🏽,👩🏼‍❤️‍👨🏾,👩🏼‍❤️‍👨🏿,👩🏽‍❤️‍👨🏻,👩🏽‍❤️‍👨🏼,👩🏽‍❤️‍👨🏽,👩🏽‍❤️‍👨🏾,👩🏽‍❤️‍👨🏿,👩🏾‍❤️‍👨🏻,👩🏾‍❤️‍👨🏼,👩🏾‍❤️‍👨🏽,👩🏾‍❤️‍👨🏾,👩🏾‍❤️‍👨🏿,👩🏿‍❤️‍👨🏻,👩🏿‍❤️‍👨🏼,👩🏿‍❤️‍👨🏽,👩🏿‍❤️‍👨🏾,👩🏿‍❤️‍👨🏿,👨🏻‍❤️‍👨🏻,👨🏻‍❤️‍👨🏼,👨🏻‍❤️‍👨🏽,👨🏻‍❤️‍👨🏾,👨🏻‍❤️‍👨🏿,👨🏼‍❤️‍👨🏻,👨🏼‍❤️‍👨🏼,👨🏼‍❤️‍👨🏽,👨🏼‍❤️‍👨🏾,👨🏼‍❤️‍👨🏿,👨🏽‍❤️‍👨🏻,👨🏽‍❤️‍👨🏼,👨🏽‍❤️‍👨🏽,👨🏽‍❤️‍👨🏾,👨🏽‍❤️‍👨🏿,👨🏾‍❤️‍👨🏻,👨🏾‍❤️‍👨🏼,👨🏾‍❤️‍👨🏽,👨🏾‍❤️‍👨🏾,👨🏾‍❤️‍👨🏿,👨🏿‍❤️‍👨🏻,👨🏿‍❤️‍👨🏼,👨🏿‍❤️‍👨🏽,👨🏿‍❤️‍👨🏾,👨🏿‍❤️‍👨🏿,👩🏻‍❤️‍👩🏻,👩🏻‍❤️‍👩🏼,👩🏻‍❤️‍👩🏽,👩🏻‍❤️‍👩🏾,👩🏻‍❤️‍👩🏿,👩🏼‍❤️‍👩🏻,👩🏼‍❤️‍👩🏼,👩🏼‍❤️‍👩🏽,👩🏼‍❤️‍👩🏾,👩🏼‍❤️‍👩🏿,👩🏽‍❤️‍👩🏻,👩🏽‍❤️‍👩🏼,👩🏽‍❤️‍👩🏽,👩🏽‍❤️‍👩🏾,👩🏽‍❤️‍👩🏿,👩🏾‍❤️‍👩🏻,👩🏾‍❤️‍👩🏼,👩🏾‍❤️‍👩🏽,👩🏾‍❤️‍👩🏾,👩🏾‍❤️‍👩🏿,👩🏿‍❤️‍👩🏻,👩🏿‍❤️‍👩🏼,👩🏿‍❤️‍👩🏽,👩🏿‍❤️‍👩🏾,👩🏿‍❤️‍👩🏿,👩‍❤️‍💋‍👨,👨‍❤️‍💋‍👨,👩‍❤️‍💋‍👩,👨‍👩‍👧‍👦,👨‍👩‍👦‍👦,👨‍👩‍👧‍👧,👨‍👨‍👧‍👦,👨‍👨‍👦‍👦,👨‍👨‍👧‍👧,👩‍👩‍👧‍👦,👩‍👩‍👦‍👦,👩‍👩‍👧‍👧,🧑‍🧑‍🧒‍🧒,🚶🏻‍♀️‍➡️,🚶🏼‍♀️‍➡️,🚶🏽‍♀️‍➡️,🚶🏾‍♀️‍➡️,🚶🏿‍♀️‍➡️,🚶🏻‍♂️‍➡️,🚶🏼‍♂️‍➡️,🚶🏽‍♂️‍➡️,🚶🏾‍♂️‍➡️,🚶🏿‍♂️‍➡️,🧎🏻‍♀️‍➡️,🧎🏼‍♀️‍➡️,🧎🏽‍♀️‍➡️,🧎🏾‍♀️‍➡️,🧎🏿‍♀️‍➡️,🧎🏻‍♂️‍➡️,🧎🏼‍♂️‍➡️,🧎🏽‍♂️‍➡️,🧎🏾‍♂️‍➡️,🧎🏿‍♂️‍➡️,🧑🏻‍🦯‍➡️,🧑🏼‍🦯‍➡️,🧑🏽‍🦯‍➡️,🧑🏾‍🦯‍➡️,🧑🏿‍🦯‍➡️,👨🏻‍🦯‍➡️,👨🏼‍🦯‍➡️,👨🏽‍🦯‍➡️,👨🏾‍🦯‍➡️,👨🏿‍🦯‍➡️,👩🏻‍🦯‍➡️,👩🏼‍🦯‍➡️,👩🏽‍🦯‍➡️,👩🏾‍🦯‍➡️,👩🏿‍🦯‍➡️,🧑🏻‍🦼‍➡️,🧑🏼‍🦼‍➡️,🧑🏽‍🦼‍➡️,🧑🏾‍🦼‍➡️,🧑🏿‍🦼‍➡️,👨🏻‍🦼‍➡️,👨🏼‍🦼‍➡️,👨🏽‍🦼‍➡️,👨🏾‍🦼‍➡️,👨🏿‍🦼‍➡️,👩🏻‍🦼‍➡️,👩🏼‍🦼‍➡️,👩🏽‍🦼‍➡️,👩🏾‍🦼‍➡️,👩🏿‍🦼‍➡️,🧑🏻‍🦽‍➡️,🧑🏼‍🦽‍➡️,🧑🏽‍🦽‍➡️,🧑🏾‍🦽‍➡️,🧑🏿‍🦽‍➡️,👨🏻‍🦽‍➡️,👨🏼‍🦽‍➡️,👨🏽‍🦽‍➡️,👨🏾‍🦽‍➡️,👨🏿‍🦽‍➡️,👩🏻‍🦽‍➡️,👩🏼‍🦽‍➡️,👩🏽‍🦽‍➡️,👩🏾‍🦽‍➡️,👩🏿‍🦽‍➡️,🏃🏻‍♀️‍➡️,🏃🏼‍♀️‍➡️,🏃🏽‍♀️‍➡️,🏃🏾‍♀️‍➡️,🏃🏿‍♀️‍➡️,🏃🏻‍♂️‍➡️,🏃🏼‍♂️‍➡️,🏃🏽‍♂️‍➡️,🏃🏾‍♂️‍➡️,🏃🏿‍♂️‍➡️,🫱🏻‍🫲🏼,🫱🏻‍🫲🏽,🫱🏻‍🫲🏾,🫱🏻‍🫲🏿,🫱🏼‍🫲🏻,🫱🏼‍🫲🏽,🫱🏼‍🫲🏾,🫱🏼‍🫲🏿,🫱🏽‍🫲🏻,🫱🏽‍🫲🏼,🫱🏽‍🫲🏾,🫱🏽‍🫲🏿,🫱🏾‍🫲🏻,🫱🏾‍🫲🏼,🫱🏾‍🫲🏽,🫱🏾‍🫲🏿,🫱🏿‍🫲🏻,🫱🏿‍🫲🏼,🫱🏿‍🫲🏽,🫱🏿‍🫲🏾,🚶‍♀️‍➡️,🚶‍♂️‍➡️,🧎‍♀️‍➡️,🧎‍♂️‍➡️,🧑‍🦯‍➡️,👨‍🦯‍➡️,👩‍🦯‍➡️,🧑‍🦼‍➡️,👨‍🦼‍➡️,👩‍🦼‍➡️,🧑‍🦽‍➡️,👨‍🦽‍➡️,👩‍🦽‍➡️,🏃‍♀️‍➡️,🏃‍♂️‍➡️,🧑‍🤝‍🧑,👩‍❤️‍👨,👨‍❤️‍👨,👩‍❤️‍👩,👨‍👩‍👦,👨‍👩‍👧,👨‍👨‍👦,👨‍👨‍👧,👩‍👩‍👦,👩‍👩‍👧,👨‍👦‍👦,👨‍👧‍👦,👨‍👧‍👧,👩‍👦‍👦,👩‍👧‍👦,👩‍👧‍👧,🧑‍🧑‍🧒,🧑‍🧒‍🧒,👁️‍🗨️,🧔🏻‍♂️,🧔🏼‍♂️,🧔🏽‍♂️,🧔🏾‍♂️,🧔🏿‍♂️,🧔🏻‍♀️,🧔🏼‍♀️,🧔🏽‍♀️,🧔🏾‍♀️,🧔🏿‍♀️,👨🏻‍🦰,👨🏼‍🦰,👨🏽‍🦰,👨🏾‍🦰,👨🏿‍🦰,👨🏻‍🦱,👨🏼‍🦱,👨🏽‍🦱,👨🏾‍🦱,👨🏿‍🦱,👨🏻‍🦳,👨🏼‍🦳,👨🏽‍🦳,👨🏾‍🦳,👨🏿‍🦳,👨🏻‍🦲,👨🏼‍🦲,👨🏽‍🦲,👨🏾‍🦲,👨🏿‍🦲,👩🏻‍🦰,👩🏼‍🦰,👩🏽‍🦰,👩🏾‍🦰,👩🏿‍🦰,🧑🏻‍🦰,🧑🏼‍🦰,🧑🏽‍🦰,🧑🏾‍🦰,🧑🏿‍🦰,👩🏻‍🦱,👩🏼‍🦱,👩🏽‍🦱,👩🏾‍🦱,👩🏿‍🦱,🧑🏻‍🦱,🧑🏼‍🦱,🧑🏽‍🦱,🧑🏾‍🦱,🧑🏿‍🦱,👩🏻‍🦳,👩🏼‍🦳,👩🏽‍🦳,👩🏾‍🦳,👩🏿‍🦳,🧑🏻‍🦳,🧑🏼‍🦳,🧑🏽‍🦳,🧑🏾‍🦳,🧑🏿‍🦳,👩🏻‍🦲,👩🏼‍🦲,👩🏽‍🦲,👩🏾‍🦲,👩🏿‍🦲,🧑🏻‍🦲,🧑🏼‍🦲,🧑🏽‍🦲,🧑🏾‍🦲,🧑🏿‍🦲,👱🏻‍♀️,👱🏼‍♀️,👱🏽‍♀️,👱🏾‍♀️,👱🏿‍♀️,👱🏻‍♂️,👱🏼‍♂️,👱🏽‍♂️,👱🏾‍♂️,👱🏿‍♂️,🙍🏻‍♂️,🙍🏼‍♂️,🙍🏽‍♂️,🙍🏾‍♂️,🙍🏿‍♂️,🙍🏻‍♀️,🙍🏼‍♀️,🙍🏽‍♀️,🙍🏾‍♀️,🙍🏿‍♀️,🙎🏻‍♂️,🙎🏼‍♂️,🙎🏽‍♂️,🙎🏾‍♂️,🙎🏿‍♂️,🙎🏻‍♀️,🙎🏼‍♀️,🙎🏽‍♀️,🙎🏾‍♀️,🙎🏿‍♀️,🙅🏻‍♂️,🙅🏼‍♂️,🙅🏽‍♂️,🙅🏾‍♂️,🙅🏿‍♂️,🙅🏻‍♀️,🙅🏼‍♀️,🙅🏽‍♀️,🙅🏾‍♀️,🙅🏿‍♀️,🙆🏻‍♂️,🙆🏼‍♂️,🙆🏽‍♂️,🙆🏾‍♂️,🙆🏿‍♂️,🙆🏻‍♀️,🙆🏼‍♀️,🙆🏽‍♀️,🙆🏾‍♀️,🙆🏿‍♀️,💁🏻‍♂️,💁🏼‍♂️,💁🏽‍♂️,💁🏾‍♂️,💁🏿‍♂️,💁🏻‍♀️,💁🏼‍♀️,💁🏽‍♀️,💁🏾‍♀️,💁🏿‍♀️,🙋🏻‍♂️,🙋🏼‍♂️,🙋🏽‍♂️,🙋🏾‍♂️,🙋🏿‍♂️,🙋🏻‍♀️,🙋🏼‍♀️,🙋🏽‍♀️,🙋🏾‍♀️,🙋🏿‍♀️,🧏🏻‍♂️,🧏🏼‍♂️,🧏🏽‍♂️,🧏🏾‍♂️,🧏🏿‍♂️,🧏🏻‍♀️,🧏🏼‍♀️,🧏🏽‍♀️,🧏🏾‍♀️,🧏🏿‍♀️,🙇🏻‍♂️,🙇🏼‍♂️,🙇🏽‍♂️,🙇🏾‍♂️,🙇🏿‍♂️,🙇🏻‍♀️,🙇🏼‍♀️,🙇🏽‍♀️,🙇🏾‍♀️,🙇🏿‍♀️,🤦🏻‍♂️,🤦🏼‍♂️,🤦🏽‍♂️,🤦🏾‍♂️,🤦🏿‍♂️,🤦🏻‍♀️,🤦🏼‍♀️,🤦🏽‍♀️,🤦🏾‍♀️,🤦🏿‍♀️,🤷🏻‍♂️,🤷🏼‍♂️,🤷🏽‍♂️,🤷🏾‍♂️,🤷🏿‍♂️,🤷🏻‍♀️,🤷🏼‍♀️,🤷🏽‍♀️,🤷🏾‍♀️,🤷🏿‍♀️,🧑🏻‍⚕️,🧑🏼‍⚕️,🧑🏽‍⚕️,🧑🏾‍⚕️,🧑🏿‍⚕️,👨🏻‍⚕️,👨🏼‍⚕️,👨🏽‍⚕️,👨🏾‍⚕️,👨🏿‍⚕️,👩🏻‍⚕️,👩🏼‍⚕️,👩🏽‍⚕️,👩🏾‍⚕️,👩🏿‍⚕️,🧑🏻‍🎓,🧑🏼‍🎓,🧑🏽‍🎓,🧑🏾‍🎓,🧑🏿‍🎓,👨🏻‍🎓,👨🏼‍🎓,👨🏽‍🎓,👨🏾‍🎓,👨🏿‍🎓,👩🏻‍🎓,👩🏼‍🎓,👩🏽‍🎓,👩🏾‍🎓,👩🏿‍🎓,🧑🏻‍🏫,🧑🏼‍🏫,🧑🏽‍🏫,🧑🏾‍🏫,🧑🏿‍🏫,👨🏻‍🏫,👨🏼‍🏫,👨🏽‍🏫,👨🏾‍🏫,👨🏿‍🏫,👩🏻‍🏫,👩🏼‍🏫,👩🏽‍🏫,👩🏾‍🏫,👩🏿‍🏫,🧑🏻‍⚖️,🧑🏼‍⚖️,🧑🏽‍⚖️,🧑🏾‍⚖️,🧑🏿‍⚖️,👨🏻‍⚖️,👨🏼‍⚖️,👨🏽‍⚖️,👨🏾‍⚖️,👨🏿‍⚖️,👩🏻‍⚖️,👩🏼‍⚖️,👩🏽‍⚖️,👩🏾‍⚖️,👩🏿‍⚖️,🧑🏻‍🌾,🧑🏼‍🌾,🧑🏽‍🌾,🧑🏾‍🌾,🧑🏿‍🌾,👨🏻‍🌾,👨🏼‍🌾,👨🏽‍🌾,👨🏾‍🌾,👨🏿‍🌾,👩🏻‍🌾,👩🏼‍🌾,👩🏽‍🌾,👩🏾‍🌾,👩🏿‍🌾,🧑🏻‍🍳,🧑🏼‍🍳,🧑🏽‍🍳,🧑🏾‍🍳,🧑🏿‍🍳,👨🏻‍🍳,👨🏼‍🍳,👨🏽‍🍳,👨🏾‍🍳,👨🏿‍🍳,👩🏻‍🍳,👩🏼‍🍳,👩🏽‍🍳,👩🏾‍🍳,👩🏿‍🍳,🧑🏻‍🔧,🧑🏼‍🔧,🧑🏽‍🔧,🧑🏾‍🔧,🧑🏿‍🔧,👨🏻‍🔧,👨🏼‍🔧,👨🏽‍🔧,👨🏾‍🔧,👨🏿‍🔧,👩🏻‍🔧,👩🏼‍🔧,👩🏽‍🔧,👩🏾‍🔧,👩🏿‍🔧,🧑🏻‍🏭,🧑🏼‍🏭,🧑🏽‍🏭,🧑🏾‍🏭,🧑🏿‍🏭,👨🏻‍🏭,👨🏼‍🏭,👨🏽‍🏭,👨🏾‍🏭,👨🏿‍🏭,👩🏻‍🏭,👩🏼‍🏭,👩🏽‍🏭,👩🏾‍🏭,👩🏿‍🏭,🧑🏻‍💼,🧑🏼‍💼,🧑🏽‍💼,🧑🏾‍💼,🧑🏿‍💼,👨🏻‍💼,👨🏼‍💼,👨🏽‍💼,👨🏾‍💼,👨🏿‍💼,👩🏻‍💼,👩🏼‍💼,👩🏽‍💼,👩🏾‍💼,👩🏿‍💼,🧑🏻‍🔬,🧑🏼‍🔬,🧑🏽‍🔬,🧑🏾‍🔬,🧑🏿‍🔬,👨🏻‍🔬,👨🏼‍🔬,👨🏽‍🔬,👨🏾‍🔬,👨🏿‍🔬,👩🏻‍🔬,👩🏼‍🔬,👩🏽‍🔬,👩🏾‍🔬,👩🏿‍🔬,🧑🏻‍💻,🧑🏼‍💻,🧑🏽‍💻,🧑🏾‍💻,🧑🏿‍💻,👨🏻‍💻,👨🏼‍💻,👨🏽‍💻,👨🏾‍💻,👨🏿‍💻,👩🏻‍💻,👩🏼‍💻,👩🏽‍💻,👩🏾‍💻,👩🏿‍💻,🧑🏻‍🎤,🧑🏼‍🎤,🧑🏽‍🎤,🧑🏾‍🎤,🧑🏿‍🎤,👨🏻‍🎤,👨🏼‍🎤,👨🏽‍🎤,👨🏾‍🎤,👨🏿‍🎤,👩🏻‍🎤,👩🏼‍🎤,👩🏽‍🎤,👩🏾‍🎤,👩🏿‍🎤,🧑🏻‍🎨,🧑🏼‍🎨,🧑🏽‍🎨,🧑🏾‍🎨,🧑🏿‍🎨,👨🏻‍🎨,👨🏼‍🎨,👨🏽‍🎨,👨🏾‍🎨,👨🏿‍🎨,👩🏻‍🎨,👩🏼‍🎨,👩🏽‍🎨,👩🏾‍🎨,👩🏿‍🎨,🧑🏻‍✈️,🧑🏼‍✈️,🧑🏽‍✈️,🧑🏾‍✈️,🧑🏿‍✈️,👨🏻‍✈️,👨🏼‍✈️,👨🏽‍✈️,👨🏾‍✈️,👨🏿‍✈️,👩🏻‍✈️,👩🏼‍✈️,👩🏽‍✈️,👩🏾‍✈️,👩🏿‍✈️,🧑🏻‍🚀,🧑🏼‍🚀,🧑🏽‍🚀,🧑🏾‍🚀,🧑🏿‍🚀,👨🏻‍🚀,👨🏼‍🚀,👨🏽‍🚀,👨🏾‍🚀,👨🏿‍🚀,👩🏻‍🚀,👩🏼‍🚀,👩🏽‍🚀,👩🏾‍🚀,👩🏿‍🚀,🧑🏻‍🚒,🧑🏼‍🚒,🧑🏽‍🚒,🧑🏾‍🚒,🧑🏿‍🚒,👨🏻‍🚒,👨🏼‍🚒,👨🏽‍🚒,👨🏾‍🚒,👨🏿‍🚒,👩🏻‍🚒,👩🏼‍🚒,👩🏽‍🚒,👩🏾‍🚒,👩🏿‍🚒,👮🏻‍♂️,👮🏼‍♂️,👮🏽‍♂️,👮🏾‍♂️,👮🏿‍♂️,👮🏻‍♀️,👮🏼‍♀️,👮🏽‍♀️,👮🏾‍♀️,👮🏿‍♀️,🕵🏻‍♂️,🕵🏼‍♂️,🕵🏽‍♂️,🕵🏾‍♂️,🕵🏿‍♂️,🕵🏻‍♀️,🕵🏼‍♀️,🕵🏽‍♀️,🕵🏾‍♀️,🕵🏿‍♀️,💂🏻‍♂️,💂🏼‍♂️,💂🏽‍♂️,💂🏾‍♂️,💂🏿‍♂️,💂🏻‍♀️,💂🏼‍♀️,💂🏽‍♀️,💂🏾‍♀️,💂🏿‍♀️,👷🏻‍♂️,👷🏼‍♂️,👷🏽‍♂️,👷🏾‍♂️,👷🏿‍♂️,👷🏻‍♀️,👷🏼‍♀️,👷🏽‍♀️,👷🏾‍♀️,👷🏿‍♀️,👳🏻‍♂️,👳🏼‍♂️,👳🏽‍♂️,👳🏾‍♂️,👳🏿‍♂️,👳🏻‍♀️,👳🏼‍♀️,👳🏽‍♀️,👳🏾‍♀️,👳🏿‍♀️,🤵🏻‍♂️,🤵🏼‍♂️,🤵🏽‍♂️,🤵🏾‍♂️,🤵🏿‍♂️,🤵🏻‍♀️,🤵🏼‍♀️,🤵🏽‍♀️,🤵🏾‍♀️,🤵🏿‍♀️,👰🏻‍♂️,👰🏼‍♂️,👰🏽‍♂️,👰🏾‍♂️,👰🏿‍♂️,👰🏻‍♀️,👰🏼‍♀️,👰🏽‍♀️,👰🏾‍♀️,👰🏿‍♀️,👩🏻‍🍼,👩🏼‍🍼,👩🏽‍🍼,👩🏾‍🍼,👩🏿‍🍼,👨🏻‍🍼,👨🏼‍🍼,👨🏽‍🍼,👨🏾‍🍼,👨🏿‍🍼,🧑🏻‍🍼,🧑🏼‍🍼,🧑🏽‍🍼,🧑🏾‍🍼,🧑🏿‍🍼,🧑🏻‍🎄,🧑🏼‍🎄,🧑🏽‍🎄,🧑🏾‍🎄,🧑🏿‍🎄,🦸🏻‍♂️,🦸🏼‍♂️,🦸🏽‍♂️,🦸🏾‍♂️,🦸🏿‍♂️,🦸🏻‍♀️,🦸🏼‍♀️,🦸🏽‍♀️,🦸🏾‍♀️,🦸🏿‍♀️,🦹🏻‍♂️,🦹🏼‍♂️,🦹🏽‍♂️,🦹🏾‍♂️,🦹🏿‍♂️,🦹🏻‍♀️,🦹🏼‍♀️,🦹🏽‍♀️,🦹🏾‍♀️,🦹🏿‍♀️,🧙🏻‍♂️,🧙🏼‍♂️,🧙🏽‍♂️,🧙🏾‍♂️,🧙🏿‍♂️,🧙🏻‍♀️,🧙🏼‍♀️,🧙🏽‍♀️,🧙🏾‍♀️,🧙🏿‍♀️,🧚🏻‍♂️,🧚🏼‍♂️,🧚🏽‍♂️,🧚🏾‍♂️,🧚🏿‍♂️,🧚🏻‍♀️,🧚🏼‍♀️,🧚🏽‍♀️,🧚🏾‍♀️,🧚🏿‍♀️,🧛🏻‍♂️,🧛🏼‍♂️,🧛🏽‍♂️,🧛🏾‍♂️,🧛🏿‍♂️,🧛🏻‍♀️,🧛🏼‍♀️,🧛🏽‍♀️,🧛🏾‍♀️,🧛🏿‍♀️,🧜🏻‍♂️,🧜🏼‍♂️,🧜🏽‍♂️,🧜🏾‍♂️,🧜🏿‍♂️,🧜🏻‍♀️,🧜🏼‍♀️,🧜🏽‍♀️,🧜🏾‍♀️,🧜🏿‍♀️,🧝🏻‍♂️,🧝🏼‍♂️,🧝🏽‍♂️,🧝🏾‍♂️,🧝🏿‍♂️,🧝🏻‍♀️,🧝🏼‍♀️,🧝🏽‍♀️,🧝🏾‍♀️,🧝🏿‍♀️,💆🏻‍♂️,💆🏼‍♂️,💆🏽‍♂️,💆🏾‍♂️,💆🏿‍♂️,💆🏻‍♀️,💆🏼‍♀️,💆🏽‍♀️,💆🏾‍♀️,💆🏿‍♀️,💇🏻‍♂️,💇🏼‍♂️,💇🏽‍♂️,💇🏾‍♂️,💇🏿‍♂️,💇🏻‍♀️,💇🏼‍♀️,💇🏽‍♀️,💇🏾‍♀️,💇🏿‍♀️,🚶🏻‍♂️,🚶🏼‍♂️,🚶🏽‍♂️,🚶🏾‍♂️,🚶🏿‍♂️,🚶🏻‍♀️,🚶🏼‍♀️,🚶🏽‍♀️,🚶🏾‍♀️,🚶🏿‍♀️,🚶🏻‍➡️,🚶🏼‍➡️,🚶🏽‍➡️,🚶🏾‍➡️,🚶🏿‍➡️,🧍🏻‍♂️,🧍🏼‍♂️,🧍🏽‍♂️,🧍🏾‍♂️,🧍🏿‍♂️,🧍🏻‍♀️,🧍🏼‍♀️,🧍🏽‍♀️,🧍🏾‍♀️,🧍🏿‍♀️,🧎🏻‍♂️,🧎🏼‍♂️,🧎🏽‍♂️,🧎🏾‍♂️,🧎🏿‍♂️,🧎🏻‍♀️,🧎🏼‍♀️,🧎🏽‍♀️,🧎🏾‍♀️,🧎🏿‍♀️,🧎🏻‍➡️,🧎🏼‍➡️,🧎🏽‍➡️,🧎🏾‍➡️,🧎🏿‍➡️,🧑🏻‍🦯,🧑🏼‍🦯,🧑🏽‍🦯,🧑🏾‍🦯,🧑🏿‍🦯,👨🏻‍🦯,👨🏼‍🦯,👨🏽‍🦯,👨🏾‍🦯,👨🏿‍🦯,👩🏻‍🦯,👩🏼‍🦯,👩🏽‍🦯,👩🏾‍🦯,👩🏿‍🦯,🧑🏻‍🦼,🧑🏼‍🦼,🧑🏽‍🦼,🧑🏾‍🦼,🧑🏿‍🦼,👨🏻‍🦼,👨🏼‍🦼,👨🏽‍🦼,👨🏾‍🦼,👨🏿‍🦼,👩🏻‍🦼,👩🏼‍🦼,👩🏽‍🦼,👩🏾‍🦼,👩🏿‍🦼,🧑🏻‍🦽,🧑🏼‍🦽,🧑🏽‍🦽,🧑🏾‍🦽,🧑🏿‍🦽,👨🏻‍🦽,👨🏼‍🦽,👨🏽‍🦽,👨🏾‍🦽,👨🏿‍🦽,👩🏻‍🦽,👩🏼‍🦽,👩🏽‍🦽,👩🏾‍🦽,👩🏿‍🦽,🏃🏻‍♂️,🏃🏼‍♂️,🏃🏽‍♂️,🏃🏾‍♂️,🏃🏿‍♂️,🏃🏻‍♀️,🏃🏼‍♀️,🏃🏽‍♀️,🏃🏾‍♀️,🏃🏿‍♀️,🏃🏻‍➡️,🏃🏼‍➡️,🏃🏽‍➡️,🏃🏾‍➡️,🏃🏿‍➡️,🧖🏻‍♂️,🧖🏼‍♂️,🧖🏽‍♂️,🧖🏾‍♂️,🧖🏿‍♂️,🧖🏻‍♀️,🧖🏼‍♀️,🧖🏽‍♀️,🧖🏾‍♀️,🧖🏿‍♀️,🧗🏻‍♂️,🧗🏼‍♂️,🧗🏽‍♂️,🧗🏾‍♂️,🧗🏿‍♂️,🧗🏻‍♀️,🧗🏼‍♀️,🧗🏽‍♀️,🧗🏾‍♀️,🧗🏿‍♀️,🏌🏻‍♂️,🏌🏼‍♂️,🏌🏽‍♂️,🏌🏾‍♂️,🏌🏿‍♂️,🏌🏻‍♀️,🏌🏼‍♀️,🏌🏽‍♀️,🏌🏾‍♀️,🏌🏿‍♀️,🏄🏻‍♂️,🏄🏼‍♂️,🏄🏽‍♂️,🏄🏾‍♂️,🏄🏿‍♂️,🏄🏻‍♀️,🏄🏼‍♀️,🏄🏽‍♀️,🏄🏾‍♀️,🏄🏿‍♀️,🚣🏻‍♂️,🚣🏼‍♂️,🚣🏽‍♂️,🚣🏾‍♂️,🚣🏿‍♂️,🚣🏻‍♀️,🚣🏼‍♀️,🚣🏽‍♀️,🚣🏾‍♀️,🚣🏿‍♀️,🏊🏻‍♂️,🏊🏼‍♂️,🏊🏽‍♂️,🏊🏾‍♂️,🏊🏿‍♂️,🏊🏻‍♀️,🏊🏼‍♀️,🏊🏽‍♀️,🏊🏾‍♀️,🏊🏿‍♀️,🏋🏻‍♂️,🏋🏼‍♂️,🏋🏽‍♂️,🏋🏾‍♂️,🏋🏿‍♂️,🏋🏻‍♀️,🏋🏼‍♀️,🏋🏽‍♀️,🏋🏾‍♀️,🏋🏿‍♀️,🚴🏻‍♂️,🚴🏼‍♂️,🚴🏽‍♂️,🚴🏾‍♂️,🚴🏿‍♂️,🚴🏻‍♀️,🚴🏼‍♀️,🚴🏽‍♀️,🚴🏾‍♀️,🚴🏿‍♀️,🚵🏻‍♂️,🚵🏼‍♂️,🚵🏽‍♂️,🚵🏾‍♂️,🚵🏿‍♂️,🚵🏻‍♀️,🚵🏼‍♀️,🚵🏽‍♀️,🚵🏾‍♀️,🚵🏿‍♀️,🤸🏻‍♂️,🤸🏼‍♂️,🤸🏽‍♂️,🤸🏾‍♂️,🤸🏿‍♂️,🤸🏻‍♀️,🤸🏼‍♀️,🤸🏽‍♀️,🤸🏾‍♀️,🤸🏿‍♀️,🤽🏻‍♂️,🤽🏼‍♂️,🤽🏽‍♂️,🤽🏾‍♂️,🤽🏿‍♂️,🤽🏻‍♀️,🤽🏼‍♀️,🤽🏽‍♀️,🤽🏾‍♀️,🤽🏿‍♀️,🤾🏻‍♂️,🤾🏼‍♂️,🤾🏽‍♂️,🤾🏾‍♂️,🤾🏿‍♂️,🤾🏻‍♀️,🤾🏼‍♀️,🤾🏽‍♀️,🤾🏾‍♀️,🤾🏿‍♀️,🤹🏻‍♂️,🤹🏼‍♂️,🤹🏽‍♂️,🤹🏾‍♂️,🤹🏿‍♂️,🤹🏻‍♀️,🤹🏼‍♀️,🤹🏽‍♀️,🤹🏾‍♀️,🤹🏿‍♀️,🧘🏻‍♂️,🧘🏼‍♂️,🧘🏽‍♂️,🧘🏾‍♂️,🧘🏿‍♂️,🧘🏻‍♀️,🧘🏼‍♀️,🧘🏽‍♀️,🧘🏾‍♀️,🧘🏿‍♀️,😶‍🌫️,🕵️‍♂️,🕵️‍♀️,🏌️‍♂️,🏌️‍♀️,🏋️‍♂️,🏋️‍♀️,🏳️‍🌈,🏳️‍⚧️,⛹🏻‍♂️,⛹🏼‍♂️,⛹🏽‍♂️,⛹🏾‍♂️,⛹🏿‍♂️,⛹🏻‍♀️,⛹🏼‍♀️,⛹🏽‍♀️,⛹🏾‍♀️,⛹🏿‍♀️,😮‍💨,🙂‍↔️,🙂‍↕️,😵‍💫,❤️‍🔥,❤️‍🩹,🧔‍♂️,🧔‍♀️,👨‍🦰,👨‍🦱,👨‍🦳,👨‍🦲,👩‍🦰,🧑‍🦰,👩‍🦱,🧑‍🦱,👩‍🦳,🧑‍🦳,👩‍🦲,🧑‍🦲,👱‍♀️,👱‍♂️,🙍‍♂️,🙍‍♀️,🙎‍♂️,🙎‍♀️,🙅‍♂️,🙅‍♀️,🙆‍♂️,🙆‍♀️,💁‍♂️,💁‍♀️,🙋‍♂️,🙋‍♀️,🧏‍♂️,🧏‍♀️,🙇‍♂️,🙇‍♀️,🤦‍♂️,🤦‍♀️,🤷‍♂️,🤷‍♀️,🧑‍⚕️,👨‍⚕️,👩‍⚕️,🧑‍🎓,👨‍🎓,👩‍🎓,🧑‍🏫,👨‍🏫,👩‍🏫,🧑‍⚖️,👨‍⚖️,👩‍⚖️,🧑‍🌾,👨‍🌾,👩‍🌾,🧑‍🍳,👨‍🍳,👩‍🍳,🧑‍🔧,👨‍🔧,👩‍🔧,🧑‍🏭,👨‍🏭,👩‍🏭,🧑‍💼,👨‍💼,👩‍💼,🧑‍🔬,👨‍🔬,👩‍🔬,🧑‍💻,👨‍💻,👩‍💻,🧑‍🎤,👨‍🎤,👩‍🎤,🧑‍🎨,👨‍🎨,👩‍🎨,🧑‍✈️,👨‍✈️,👩‍✈️,🧑‍🚀,👨‍🚀,👩‍🚀,🧑‍🚒,👨‍🚒,👩‍🚒,👮‍♂️,👮‍♀️,💂‍♂️,💂‍♀️,👷‍♂️,👷‍♀️,👳‍♂️,👳‍♀️,🤵‍♂️,🤵‍♀️,👰‍♂️,👰‍♀️,👩‍🍼,👨‍🍼,🧑‍🍼,🧑‍🎄,🦸‍♂️,🦸‍♀️,🦹‍♂️,🦹‍♀️,🧙‍♂️,🧙‍♀️,🧚‍♂️,🧚‍♀️,🧛‍♂️,🧛‍♀️,🧜‍♂️,🧜‍♀️,🧝‍♂️,🧝‍♀️,🧞‍♂️,🧞‍♀️,🧟‍♂️,🧟‍♀️,💆‍♂️,💆‍♀️,💇‍♂️,💇‍♀️,🚶‍♂️,🚶‍♀️,🚶‍➡️,🧍‍♂️,🧍‍♀️,🧎‍♂️,🧎‍♀️,🧎‍➡️,🧑‍🦯,👨‍🦯,👩‍🦯,🧑‍🦼,👨‍🦼,👩‍🦼,🧑‍🦽,👨‍🦽,👩‍🦽,🏃‍♂️,🏃‍♀️,🏃‍➡️,👯‍♂️,👯‍♀️,🧖‍♂️,🧖‍♀️,🧗‍♂️,🧗‍♀️,🏄‍♂️,🏄‍♀️,🚣‍♂️,🚣‍♀️,🏊‍♂️,🏊‍♀️,⛹️‍♂️,⛹️‍♀️,🚴‍♂️,🚴‍♀️,🚵‍♂️,🚵‍♀️,🤸‍♂️,🤸‍♀️,🤼‍♂️,🤼‍♀️,🤽‍♂️,🤽‍♀️,🤾‍♂️,🤾‍♀️,🤹‍♂️,🤹‍♀️,🧘‍♂️,🧘‍♀️,👨‍👦,👨‍👧,👩‍👦,👩‍👧,🧑‍🧒,🐕‍🦺,🐻‍❄️,🐦‍🔥,🍋‍🟩,🍄‍🟫,⛓️‍💥,🏴‍☠️,🐈‍⬛,🐦‍⬛,👋🏻,👋🏼,👋🏽,👋🏾,👋🏿,🤚🏻,🤚🏼,🤚🏽,🤚🏾,🤚🏿,🖐🏻,🖐🏼,🖐🏽,🖐🏾,🖐🏿,🖖🏻,🖖🏼,🖖🏽,🖖🏾,🖖🏿,🫱🏻,🫱🏼,🫱🏽,🫱🏾,🫱🏿,🫲🏻,🫲🏼,🫲🏽,🫲🏾,🫲🏿,🫳🏻,🫳🏼,🫳🏽,🫳🏾,🫳🏿,🫴🏻,🫴🏼,🫴🏽,🫴🏾,🫴🏿,🫷🏻,🫷🏼,🫷🏽,🫷🏾,🫷🏿,🫸🏻,🫸🏼,🫸🏽,🫸🏾,🫸🏿,👌🏻,👌🏼,👌🏽,👌🏾,👌🏿,🤌🏻,🤌🏼,🤌🏽,🤌🏾,🤌🏿,🤏🏻,🤏🏼,🤏🏽,🤏🏾,🤏🏿,🤞🏻,🤞🏼,🤞🏽,🤞🏾,🤞🏿,🫰🏻,🫰🏼,🫰🏽,🫰🏾,🫰🏿,🤟🏻,🤟🏼,🤟🏽,🤟🏾,🤟🏿,🤘🏻,🤘🏼,🤘🏽,🤘🏾,🤘🏿,🤙🏻,🤙🏼,🤙🏽,🤙🏾,🤙🏿,👈🏻,👈🏼,👈🏽,👈🏾,👈🏿,👉🏻,👉🏼,👉🏽,👉🏾,👉🏿,👆🏻,👆🏼,👆🏽,👆🏾,👆🏿,🖕🏻,🖕🏼,🖕🏽,🖕🏾,🖕🏿,👇🏻,👇🏼,👇🏽,👇🏾,👇🏿,🫵🏻,🫵🏼,🫵🏽,🫵🏾,🫵🏿,👍🏻,👍🏼,👍🏽,👍🏾,👍🏿,👎🏻,👎🏼,👎🏽,👎🏾,👎🏿,👊🏻,👊🏼,👊🏽,👊🏾,👊🏿,🤛🏻,🤛🏼,🤛🏽,🤛🏾,🤛🏿,🤜🏻,🤜🏼,🤜🏽,🤜🏾,🤜🏿,👏🏻,👏🏼,👏🏽,👏🏾,👏🏿,🙌🏻,🙌🏼,🙌🏽,🙌🏾,🙌🏿,🫶🏻,🫶🏼,🫶🏽,🫶🏾,🫶🏿,👐🏻,👐🏼,👐🏽,👐🏾,👐🏿,🤲🏻,🤲🏼,🤲🏽,🤲🏾,🤲🏿,🤝🏻,🤝🏼,🤝🏽,🤝🏾,🤝🏿,🙏🏻,🙏🏼,🙏🏽,🙏🏾,🙏🏿,💅🏻,💅🏼,💅🏽,💅🏾,💅🏿,🤳🏻,🤳🏼,🤳🏽,🤳🏾,🤳🏿,💪🏻,💪🏼,💪🏽,💪🏾,💪🏿,🦵🏻,🦵🏼,🦵🏽,🦵🏾,🦵🏿,🦶🏻,🦶🏼,🦶🏽,🦶🏾,🦶🏿,👂🏻,👂🏼,👂🏽,👂🏾,👂🏿,🦻🏻,🦻🏼,🦻🏽,🦻🏾,🦻🏿,👃🏻,👃🏼,👃🏽,👃🏾,👃🏿,👶🏻,👶🏼,👶🏽,👶🏾,👶🏿,🧒🏻,🧒🏼,🧒🏽,🧒🏾,🧒🏿,👦🏻,👦🏼,👦🏽,👦🏾,👦🏿,👧🏻,👧🏼,👧🏽,👧🏾,👧🏿,🧑🏻,🧑🏼,🧑🏽,🧑🏾,🧑🏿,👱🏻,👱🏼,👱🏽,👱🏾,👱🏿,👨🏻,👨🏼,👨🏽,👨🏾,👨🏿,🧔🏻,🧔🏼,🧔🏽,🧔🏾,🧔🏿,👩🏻,👩🏼,👩🏽,👩🏾,👩🏿,🧓🏻,🧓🏼,🧓🏽,🧓🏾,🧓🏿,👴🏻,👴🏼,👴🏽,👴🏾,👴🏿,👵🏻,👵🏼,👵🏽,👵🏾,👵🏿,🙍🏻,🙍🏼,🙍🏽,🙍🏾,🙍🏿,🙎🏻,🙎🏼,🙎🏽,🙎🏾,🙎🏿,🙅🏻,🙅🏼,🙅🏽,🙅🏾,🙅🏿,🙆🏻,🙆🏼,🙆🏽,🙆🏾,🙆🏿,💁🏻,💁🏼,💁🏽,💁🏾,💁🏿,🙋🏻,🙋🏼,🙋🏽,🙋🏾,🙋🏿,🧏🏻,🧏🏼,🧏🏽,🧏🏾,🧏🏿,🙇🏻,🙇🏼,🙇🏽,🙇🏾,🙇🏿,🤦🏻,🤦🏼,🤦🏽,🤦🏾,🤦🏿,🤷🏻,🤷🏼,🤷🏽,🤷🏾,🤷🏿,👮🏻,👮🏼,👮🏽,👮🏾,👮🏿,🕵🏻,🕵🏼,🕵🏽,🕵🏾,🕵🏿,💂🏻,💂🏼,💂🏽,💂🏾,💂🏿,🥷🏻,🥷🏼,🥷🏽,🥷🏾,🥷🏿,👷🏻,👷🏼,👷🏽,👷🏾,👷🏿,🫅🏻,🫅🏼,🫅🏽,🫅🏾,🫅🏿,🤴🏻,🤴🏼,🤴🏽,🤴🏾,🤴🏿,👸🏻,👸🏼,👸🏽,👸🏾,👸🏿,👳🏻,👳🏼,👳🏽,👳🏾,👳🏿,👲🏻,👲🏼,👲🏽,👲🏾,👲🏿,🧕🏻,🧕🏼,🧕🏽,🧕🏾,🧕🏿,🤵🏻,🤵🏼,🤵🏽,🤵🏾,🤵🏿,👰🏻,👰🏼,👰🏽,👰🏾,👰🏿,🤰🏻,🤰🏼,🤰🏽,🤰🏾,🤰🏿,🫃🏻,🫃🏼,🫃🏽,🫃🏾,🫃🏿,🫄🏻,🫄🏼,🫄🏽,🫄🏾,🫄🏿,🤱🏻,🤱🏼,🤱🏽,🤱🏾,🤱🏿,👼🏻,👼🏼,👼🏽,👼🏾,👼🏿,🎅🏻,🎅🏼,🎅🏽,🎅🏾,🎅🏿,🤶🏻,🤶🏼,🤶🏽,🤶🏾,🤶🏿,🦸🏻,🦸🏼,🦸🏽,🦸🏾,🦸🏿,🦹🏻,🦹🏼,🦹🏽,🦹🏾,🦹🏿,🧙🏻,🧙🏼,🧙🏽,🧙🏾,🧙🏿,🧚🏻,🧚🏼,🧚🏽,🧚🏾,🧚🏿,🧛🏻,🧛🏼,🧛🏽,🧛🏾,🧛🏿,🧜🏻,🧜🏼,🧜🏽,🧜🏾,🧜🏿,🧝🏻,🧝🏼,🧝🏽,🧝🏾,🧝🏿,💆🏻,💆🏼,💆🏽,💆🏾,💆🏿,💇🏻,💇🏼,💇🏽,💇🏾,💇🏿,🚶🏻,🚶🏼,🚶🏽,🚶🏾,🚶🏿,🧍🏻,🧍🏼,🧍🏽,🧍🏾,🧍🏿,🧎🏻,🧎🏼,🧎🏽,🧎🏾,🧎🏿,🏃🏻,🏃🏼,🏃🏽,🏃🏾,🏃🏿,💃🏻,💃🏼,💃🏽,💃🏾,💃🏿,🕺🏻,🕺🏼,🕺🏽,🕺🏾,🕺🏿,🕴🏻,🕴🏼,🕴🏽,🕴🏾,🕴🏿,🧖🏻,🧖🏼,🧖🏽,🧖🏾,🧖🏿,🧗🏻,🧗🏼,🧗🏽,🧗🏾,🧗🏿,🏇🏻,🏇🏼,🏇🏽,🏇🏾,🏇🏿,🏂🏻,🏂🏼,🏂🏽,🏂🏾,🏂🏿,🏌🏻,🏌🏼,🏌🏽,🏌🏾,🏌🏿,🏄🏻,🏄🏼,🏄🏽,🏄🏾,🏄🏿,🚣🏻,🚣🏼,🚣🏽,🚣🏾,🚣🏿,🏊🏻,🏊🏼,🏊🏽,🏊🏾,🏊🏿,🏋🏻,🏋🏼,🏋🏽,🏋🏾,🏋🏿,🚴🏻,🚴🏼,🚴🏽,🚴🏾,🚴🏿,🚵🏻,🚵🏼,🚵🏽,🚵🏾,🚵🏿,🤸🏻,🤸🏼,🤸🏽,🤸🏾,🤸🏿,🤽🏻,🤽🏼,🤽🏽,🤽🏾,🤽🏿,🤾🏻,🤾🏼,🤾🏽,🤾🏾,🤾🏿,🤹🏻,🤹🏼,🤹🏽,🤹🏾,🤹🏿,🧘🏻,🧘🏼,🧘🏽,🧘🏾,🧘🏿,🛀🏻,🛀🏼,🛀🏽,🛀🏾,🛀🏿,🛌🏻,🛌🏼,🛌🏽,🛌🏾,🛌🏿,👭🏻,👭🏼,👭🏽,👭🏾,👭🏿,👫🏻,👫🏼,👫🏽,👫🏾,👫🏿,👬🏻,👬🏼,👬🏽,👬🏾,👬🏿,💏🏻,💏🏼,💏🏽,💏🏾,💏🏿,💑🏻,💑🏼,💑🏽,💑🏾,💑🏿,#️⃣,0️⃣,1️⃣,2️⃣,3️⃣,4️⃣,5️⃣,6️⃣,7️⃣,8️⃣,9️⃣,✋🏻,✋🏼,✋🏽,✋🏾,✋🏿,✌🏻,✌🏼,✌🏽,✌🏾,✌🏿,☝🏻,☝🏼,☝🏽,☝🏾,☝🏿,✊🏻,✊🏼,✊🏽,✊🏾,✊🏿,✍🏻,✍🏼,✍🏽,✍🏾,✍🏿,⛹🏻,⛹🏼,⛹🏽,⛹🏾,⛹🏿,😀,😃,😄,😁,😆,😅,🤣,😂,🙂,🙃,🫠,😉,😊,😇,🥰,😍,🤩,😘,😗,😚,😙,🥲,😋,😛,😜,🤪,😝,🤑,🤗,🤭,🫢,🫣,🤫,🤔,🫡,🤐,🤨,😐,😑,😶,🫥,😏,😒,🙄,😬,🤥,🫨,😌,😔,😪,🤤,😴,😷,🤒,🤕,🤢,🤮,🤧,🥵,🥶,🥴,😵,🤯,🤠,🥳,🥸,😎,🤓,🧐,😕,🫤,😟,🙁,😮,😯,😲,😳,🥺,🥹,😦,😧,😨,😰,😥,😢,😭,😱,😖,😣,😞,😓,😩,😫,🥱,😤,😡,😠,🤬,😈,👿,💀,💩,🤡,👹,👺,👻,👽,👾,🤖,😺,😸,😹,😻,😼,😽,🙀,😿,😾,🙈,🙉,🙊,💌,💘,💝,💖,💗,💓,💞,💕,💟,💔,🩷,🧡,💛,💚,💙,🩵,💜,🤎,🖤,🩶,🤍,💋,💯,💢,💥,💫,💦,💨,🕳,💬,🗨,🗯,💭,💤,👋,🤚,🖐,🖖,🫱,🫲,🫳,🫴,🫷,🫸,👌,🤌,🤏,🤞,🫰,🤟,🤘,🤙,👈,👉,👆,🖕,👇,🫵,👍,👎,👊,🤛,🤜,👏,🙌,🫶,👐,🤲,🤝,🙏,💅,🤳,💪,🦾,🦿,🦵,🦶,👂,🦻,👃,🧠,🫀,🫁,🦷,🦴,👀,👁,👅,👄,🫦,👶,🧒,👦,👧,🧑,👱,👨,🧔,👩,🧓,👴,👵,🙍,🙎,🙅,🙆,💁,🙋,🧏,🙇,🤦,🤷,👮,🕵,💂,🥷,👷,🫅,🤴,👸,👳,👲,🧕,🤵,👰,🤰,🫃,🫄,🤱,👼,🎅,🤶,🦸,🦹,🧙,🧚,🧛,🧜,🧝,🧞,🧟,🧌,💆,💇,🚶,🧍,🧎,🏃,💃,🕺,🕴,👯,🧖,🧗,🤺,🏇,🏂,🏌,🏄,🚣,🏊,🏋,🚴,🚵,🤸,🤼,🤽,🤾,🤹,🧘,🛀,🛌,👭,👫,👬,💏,💑,🗣,👤,👥,🫂,👪,👣,🦰,🦱,🦳,🦲,🐵,🐒,🦍,🦧,🐶,🐕,🦮,🐩,🐺,🦊,🦝,🐱,🐈,🦁,🐯,🐅,🐆,🐴,🫎,🫏,🐎,🦄,🦓,🦌,🦬,🐮,🐂,🐃,🐄,🐷,🐖,🐗,🐽,🐏,🐑,🐐,🐪,🐫,🦙,🦒,🐘,🦣,🦏,🦛,🐭,🐁,🐀,🐹,🐰,🐇,🐿,🦫,🦔,🦇,🐻,🐨,🐼,🦥,🦦,🦨,🦘,🦡,🐾,🦃,🐔,🐓,🐣,🐤,🐥,🐦,🐧,🕊,🦅,🦆,🦢,🦉,🦤,🪶,🦩,🦚,🦜,🪽,🪿,🐸,🐊,🐢,🦎,🐍,🐲,🐉,🦕,🦖,🐳,🐋,🐬,🦭,🐟,🐠,🐡,🦈,🐙,🐚,🪸,🪼,🐌,🦋,🐛,🐜,🐝,🪲,🐞,🦗,🪳,🕷,🕸,🦂,🦟,🪰,🪱,🦠,💐,🌸,💮,🪷,🏵,🌹,🥀,🌺,🌻,🌼,🌷,🪻,🌱,🪴,🌲,🌳,🌴,🌵,🌾,🌿,🍀,🍁,🍂,🍃,🪹,🪺,🍄,🍇,🍈,🍉,🍊,🍋,🍌,🍍,🥭,🍎,🍏,🍐,🍑,🍒,🍓,🫐,🥝,🍅,🫒,🥥,🥑,🍆,🥔,🥕,🌽,🌶,🫑,🥒,🥬,🥦,🧄,🧅,🥜,🫘,🌰,🫚,🫛,🍞,🥐,🥖,🫓,🥨,🥯,🥞,🧇,🧀,🍖,🍗,🥩,🥓,🍔,🍟,🍕,🌭,🥪,🌮,🌯,🫔,🥙,🧆,🥚,🍳,🥘,🍲,🫕,🥣,🥗,🍿,🧈,🧂,🥫,🍱,🍘,🍙,🍚,🍛,🍜,🍝,🍠,🍢,🍣,🍤,🍥,🥮,🍡,🥟,🥠,🥡,🦀,🦞,🦐,🦑,🦪,🍦,🍧,🍨,🍩,🍪,🎂,🍰,🧁,🥧,🍫,🍬,🍭,🍮,🍯,🍼,🥛,🫖,🍵,🍶,🍾,🍷,🍸,🍹,🍺,🍻,🥂,🥃,🫗,🥤,🧋,🧃,🧉,🧊,🥢,🍽,🍴,🥄,🔪,🫙,🏺,🌍,🌎,🌏,🌐,🗺,🗾,🧭,🏔,🌋,🗻,🏕,🏖,🏜,🏝,🏞,🏟,🏛,🏗,🧱,🪨,🪵,🛖,🏘,🏚,🏠,🏡,🏢,🏣,🏤,🏥,🏦,🏨,🏩,🏪,🏫,🏬,🏭,🏯,🏰,💒,🗼,🗽,🕌,🛕,🕍,🕋,🌁,🌃,🏙,🌄,🌅,🌆,🌇,🌉,🎠,🛝,🎡,🎢,💈,🎪,🚂,🚃,🚄,🚅,🚆,🚇,🚈,🚉,🚊,🚝,🚞,🚋,🚌,🚍,🚎,🚐,🚑,🚒,🚓,🚔,🚕,🚖,🚗,🚘,🚙,🛻,🚚,🚛,🚜,🏎,🏍,🛵,🦽,🦼,🛺,🚲,🛴,🛹,🛼,🚏,🛣,🛤,🛢,🛞,🚨,🚥,🚦,🛑,🚧,🛟,🛶,🚤,🛳,🛥,🚢,🛩,🛫,🛬,🪂,💺,🚁,🚟,🚠,🚡,🛰,🚀,🛸,🛎,🧳,🕰,🕛,🕧,🕐,🕜,🕑,🕝,🕒,🕞,🕓,🕟,🕔,🕠,🕕,🕡,🕖,🕢,🕗,🕣,🕘,🕤,🕙,🕥,🕚,🕦,🌑,🌒,🌓,🌔,🌕,🌖,🌗,🌘,🌙,🌚,🌛,🌜,🌡,🌝,🌞,🪐,🌟,🌠,🌌,🌤,🌥,🌦,🌧,🌨,🌩,🌪,🌫,🌬,🌀,🌈,🌂,🔥,💧,🌊,🎃,🎄,🎆,🎇,🧨,🎈,🎉,🎊,🎋,🎍,🎎,🎏,🎐,🎑,🧧,🎀,🎁,🎗,🎟,🎫,🎖,🏆,🏅,🥇,🥈,🥉,🥎,🏀,🏐,🏈,🏉,🎾,🥏,🎳,🏏,🏑,🏒,🥍,🏓,🏸,🥊,🥋,🥅,🎣,🤿,🎽,🎿,🛷,🥌,🎯,🪀,🪁,🔫,🎱,🔮,🪄,🎮,🕹,🎰,🎲,🧩,🧸,🪅,🪩,🪆,🃏,🀄,🎴,🎭,🖼,🎨,🧵,🪡,🧶,🪢,👓,🕶,🥽,🥼,🦺,👔,👕,👖,🧣,🧤,🧥,🧦,👗,👘,🥻,🩱,🩲,🩳,👙,👚,🪭,👛,👜,👝,🛍,🎒,🩴,👞,👟,🥾,🥿,👠,👡,🩰,👢,🪮,👑,👒,🎩,🎓,🧢,🪖,📿,💄,💍,💎,🔇,🔈,🔉,🔊,📢,📣,📯,🔔,🔕,🎼,🎵,🎶,🎙,🎚,🎛,🎤,🎧,📻,🎷,🪗,🎸,🎹,🎺,🎻,🪕,🥁,🪘,🪇,🪈,📱,📲,📞,📟,📠,🔋,🪫,🔌,💻,🖥,🖨,🖱,🖲,💽,💾,💿,📀,🧮,🎥,🎞,📽,🎬,📺,📷,📸,📹,📼,🔍,🔎,🕯,💡,🔦,🏮,🪔,📔,📕,📖,📗,📘,📙,📚,📓,📒,📃,📜,📄,📰,🗞,📑,🔖,🏷,💰,🪙,💴,💵,💶,💷,💸,💳,🧾,💹,📧,📨,📩,📤,📥,📦,📫,📪,📬,📭,📮,🗳,🖋,🖊,🖌,🖍,📝,💼,📁,📂,🗂,📅,📆,🗒,🗓,📇,📈,📉,📊,📋,📌,📍,📎,🖇,📏,📐,🗃,🗄,🗑,🔒,🔓,🔏,🔐,🔑,🗝,🔨,🪓,🛠,🗡,💣,🪃,🏹,🛡,🪚,🔧,🪛,🔩,🗜,🦯,🔗,🪝,🧰,🧲,🪜,🧪,🧫,🧬,🔬,🔭,📡,💉,🩸,💊,🩹,🩼,🩺,🩻,🚪,🛗,🪞,🪟,🛏,🛋,🪑,🚽,🪠,🚿,🛁,🪤,🪒,🧴,🧷,🧹,🧺,🧻,🪣,🧼,🫧,🪥,🧽,🧯,🛒,🚬,🪦,🧿,🪬,🗿,🪧,🪪,🏧,🚮,🚰,🚹,🚺,🚻,🚼,🚾,🛂,🛃,🛄,🛅,🚸,🚫,🚳,🚭,🚯,🚱,🚷,📵,🔞,🔃,🔄,🔙,🔚,🔛,🔜,🔝,🛐,🕉,🕎,🔯,🪯,🔀,🔁,🔂,🔼,🔽,🎦,🔅,🔆,📶,🛜,📳,📴,🟰,💱,💲,🔱,📛,🔰,🔟,🔠,🔡,🔢,🔣,🔤,🅰,🆎,🅱,🆑,🆒,🆓,🆔,🆕,🆖,🅾,🆗,🅿,🆘,🆙,🆚,🈁,🈂,🈷,🈶,🈯,🉐,🈹,🈚,🈲,🉑,🈸,🈴,🈳,🈺,🈵,🔴,🟠,🟡,🟢,🔵,🟣,🟤,🟥,🟧,🟨,🟩,🟦,🟪,🟫,🔶,🔷,🔸,🔹,🔺,🔻,💠,🔘,🔳,🔲,🏁,🚩,🎌,🏴,🏳,🏻,🏼,🏽,🏾,🏿,☺,☹,☠,❣,❤,✋,✌,☝,✊,✍,⛷,⛹,☘,☕,⛰,⛪,⛩,⛲,⛺,♨,⛽,⚓,⛵,⛴,✈,⌛,⏳,⌚,⏰,⏱,⏲,☀,⭐,☁,⛅,⛈,☂,☔,⛱,⚡,❄,☃,⛄,☄,✨,⚽,⚾,⛳,⛸,♠,♥,♦,♣,♟,⛑,☎,⌨,✉,✏,✒,✂,⛏,⚒,⚔,⚙,⚖,⛓,⚗,⚰,⚱,♿,⚠,⛔,☢,☣,⬆,↗,➡,↘,⬇,↙,⬅,↖,↕,↔,↩,↪,⤴,⤵,⚛,✡,☸,☯,✝,☦,☪,☮,♈,♉,♊,♋,♌,♍,♎,♏,♐,♑,♒,♓,⛎,▶,⏩,⏭,⏯,◀,⏪,⏮,⏫,⏬,⏸,⏹,⏺,⏏,♀,♂,⚧,✖,➕,➖,➗,♾,‼,⁉,❓,❔,❕,❗,〰,⚕,♻,⚜,⭕,✅,☑,✔,❌,❎,➰,➿,〽,✳,✴,❇,©,®,™,ℹ,Ⓜ,㊗,㊙,⚫,⚪,⬛,⬜,◼,◻,◾,◽,▪,▫🏿‍❤️‍👩🏿"; // 이모티콘 리스트를 여기서 설정

        const emojisList = sourceEmojis.split(",").map((e) => ({
          key: e,
          rgb: getEmojiColor(e, hiddenCtx), // 이모티콘의 평균 색상 계산
        }));

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const imgData = hiddenCtx.getImageData(
              col * pSize,
              row * pSize,
              pSize,
              pSize
            );
            const avgColor = getAverageColor(imgData.data);

            const closestEmoji = findClosestEmoji(avgColor, emojisList);
            if (closestEmoji) {
              resultCtx.font = `${scale}px Segoe UI Emoji`;
              resultCtx.fillText(closestEmoji.key, col * scale, row * scale);
            }
          }
        }

        const mosaicDataUrl = resultCanvas.toDataURL();
        setEmojiMosaic(mosaicDataUrl);
      }
    };
  };

  const getAverageColor = (data: Uint8ClampedArray) => {
    let r = 0,
      g = 0,
      b = 0,
      count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    return [r / count, g / count, b / count];
  };

  const getEmojiColor = (
    emoji: string,
    hiddenCtx: CanvasRenderingContext2D
  ) => {
    const canvasSize = 10;
    hiddenCtx.clearRect(0, 0, canvasSize, canvasSize);
    hiddenCtx.font = `${canvasSize}px Segoe UI Emoji`;
    hiddenCtx.fillText(emoji, 0, canvasSize);

    const imgData = hiddenCtx.getImageData(0, 0, canvasSize, canvasSize);
    return getAverageColor(imgData.data);
  };

  const findClosestEmoji = (color: number[], emojisList: any[]) => {
    let minDiff = Infinity;
    let closestEmoji = null;

    for (const emoji of emojisList) {
      const diff = colorDifference(emoji.rgb, color);
      if (diff < minDiff) {
        minDiff = diff;
        closestEmoji = emoji;
      }
    }

    return closestEmoji;
  };

  const colorDifference = (rgb1: number[], rgb2: number[]) => {
    return Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
    );
  };

  const calculateFinalScore = (predictions: any) => {
    const weights: { [key: string]: number } = {
      "1": 1.0,
      "2": 0.9,
      "3": 0.7,
      "4": 0.6,
      "5": 0.5,
      "6": 0.4,
      "7": 0.1,
    };

    let weightedSum = 0;
    predictions.forEach((prediction: any) => {
      const weight = weights[prediction.className] || 0;
      weightedSum += prediction.probability * weight;
    });

    const finalScore = weightedSum * 100;
    return finalScore;
  };

  const mutation = useMutation<AxiosResponse, AxiosError, number>({
    mutationFn: (faceScore: number) =>
      axios.put(
        `${APPLICATION_SERVER_URL}face/score`,
        { faceScore },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 사용자 JWT를 헤더에 포함
          },
        }
      ),
    onSuccess: (data, faceScore) => {
      console.log("인증 점수가 성공적으로 전송되었습니다:", data);
      console.log(`보낸 얼굴 점수 ${faceScore}`);
      // 모달 닫기
    },
    onError: (error) => {
      console.error("점수 전송 중 오류가 발생했습니다:", error);
      alert("점수 전송 중 오류가 발생했습니다. 다시 시도해 주세요.");
    },
  });

  const uploadImageToS3 = async (imageUrl: string, imageData: string) => {
    try {
      const base64ImageData = imageData.replace(/^data:image\/\w+;base64,/, "");

      // Convert the Base64 string to binary data
      const binaryImageData = Buffer.from(base64ImageData, "base64");
      await axios.put(imageUrl, binaryImageData, {
        headers: {
          "Content-Type": "image/png", // 이미지의 MIME 타입 지정
        },
      });
      console.log("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const fetchS3Url = async () => {
    const imageName = `${uuidv4()}.png`;
    const prefix = "montage";
    const response = await axios.get(`${APPLICATION_SERVER_URL}face`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 사용자 JWT를 헤더에 포함
      },
      params: {
        imageName,
        prefix,
      },
    });
    return response.data.url;
  };

  const retakeImage = () => {
    setImagePreview(null);
    setFacePreview(null);
    setEmojiMosaic(null);
    setFinalScore(null);
    setLoading(false);
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const onVerificationComplete = async () => {
    if (finalScore !== null && emojiMosaic) {
      try {
        // mutation.mutate(Math.ceil(finalScore));
        const s3Url = await fetchS3Url();
        console.log(emojiMosaic);
        await uploadImageToS3(s3Url, emojiMosaic);
        await updateFaceScore(token as string, Math.ceil(finalScore)); // updateFaceScore 함수 사용
        try {
          console.log("Calling stopCamera");
          await stopCamera();
          console.log("Camera stopped successfully");
        } catch (stopCameraError) {
          console.error("Error stopping camera:", stopCameraError);
        }
        resetState();
        onComplete(); // 얼굴인증완료
      } catch (error) {
        console.error("Verification process failed:", error);
        alert("인증 과정 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } else {
      alert("인증 과정 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleVerification = () => {
    if (imagePreview) {
      onVerificationComplete();
    } else {
      alert("사진을 촬영해 주세요.");
    }
  };

  const handleClose = async () => {
    await stopCamera(); // 카메라 스트림을 먼저 종료
    onClose(); // 모달을 닫기
  };

  return (
    <BiggerModal isOpen={isOpen} onClose={handleClose} title="얼굴 인증">
      <div className="flex flex-col items-center">
        <div className="mb-4">
          {!imagePreview ? (
            <>
              <p
                style={{ fontFamily: "DNFBitBitv2", fontSize: "24px" }}
                className="mb-12 text-center text-lg"
              >
                인증되지 않은 사용자는 첫 인증 후 play 할 수 있습니다.
              </p>
              <div className="flex justify-center">
                <video
                  ref={videoRef}
                  className="max-h-xs mb-6 max-w-xs rounded border-8 border-purple-500"
                />
              </div>
              <div className="mt-10">
                <button
                  onClick={captureImage}
                  className={`rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110 active:brightness-90`}
                  style={{ fontFamily: "DNFBitBitv2" }}
                >
                  사진 촬영
                </button>
              </div>
            </>
          ) : (
            <>
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="spinning-coin-fall-container">
                    <div className="spinning-coin-fall">
                      <img
                        src={heart}
                        alt=""
                        style={{ width: "80px", height: "80px" }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {finalScore !== null && (
                    <div className="mb-4">
                      <p
                        style={{ fontFamily: "DNFBitBitv2", fontSize: "24px" }}
                        className="mb-12 text-center text-lg"
                      >
                        당신의 얼굴점수는 {Math.ceil(finalScore)} 입니다.{" "}
                      </p>{" "}
                      {/* 종합 점수만 표시 */}
                    </div>
                  )}
                  <div className="mb-4 flex justify-center">
                    <img
                      id="face-preview"
                      src={facePreview!}
                      alt="Face Preview"
                      className="max-h-xs mb-4 ml-2 max-w-xs"
                    />
                    <img
                      id="emoji-mosaic-preview"
                      src={emojiMosaic!}
                      alt="Emoji Mosaic Preview"
                      className="max-h-xs mb-4 mr-2 max-w-xs"
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={retakeImage}
                      className={`rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110 active:brightness-90`}
                      style={{ fontFamily: "DNFBitBitv2" }}
                    >
                      다시 촬영
                    </button>
                    <button
                      onClick={handleVerification}
                      className={`rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110 active:brightness-90`}
                      style={{ fontFamily: "DNFBitBitv2" }}
                    >
                      인증하기
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
        <canvas ref={hiddenCanvasRef} style={{ display: "none" }} />
      </div>
    </BiggerModal>
    /*
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="얼굴 인증">
      <div className="flex flex-col items-center">
        <p style={{fontFamily: "DNFBitBitv2", fontSize: '20px'}} className="mb-4 text-center text-lg">
          인증되지 않은 사용자는 첫 인증 후 play 할 수 있습니다.
        </p>
        <div className="mb-4">
          <video ref={videoRef} className="mb-4 max-w-xs max-h-xs" />
          <button
            onClick={captureImage}
            className={`active:brightness-90" rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110`}
              style={{
                fontFamily: "DNFBitBitv2",
              }}
          >
            사진 촬영
          </button>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />

        {imagePreview && (
          <div className="mb-4">
            <p style={{fontFamily: "DNFBitBitv2", fontSize: '18px'}}>원본 이미지</p>
            <img
              id="image-preview"
              src={imagePreview}
              alt="Image Preview"
              className="mb-4 max-w-xs max-h-xs"
            />
          </div>
        )}

        {facePreview && (
          <div className="mb-4">
            <p style={{fontFamily: "DNFBitBitv2", fontSize: '18px'}}>추출된 얼굴 이미지</p>
            <img
              id="face-preview"
              src={facePreview}
              alt="Face Preview"
              className="mb-4 max-w-xs max-h-xs"
            />
          </div>
        )}

        {emojiMosaic && (
          <div className="mb-4">
            <p style={{fontFamily: "DNFBitBitv2", fontSize: '18px'}}>이모티콘 모자이크 이미지</p>
            <img
              id="emoji-mosaic-preview"
              src={emojiMosaic}
              alt="Emoji Mosaic Preview"
              className="mb-4 max-w-xs max-h-xs"
            />
          </div>
        )}

        {finalScore !== null && (
          <div className="mb-4">
            <p style={{fontFamily: "DNFBitBitv2", fontSize: '18px'}}>얼굴 점수: {Math.ceil(finalScore)}</p> 
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleVerification}
            disabled={!emojiMosaic}
            className={`active:brightness-90" rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110 ${
            emojiMosaic
              ? "bg-custom-purple-color hover:bg-purple-950"
              : "cursor-not-allowed bg-gray-300"
            }`}
            style={{
              fontFamily: "DNFBitBitv2",
            }}
          >
            인증하기
          </button>
          <button
            onClick={() => {
              onClose();
              resetState(); // 모달을 닫을 때 상태를 초기화
            }}
            className={`active:brightness-90" rounded-lg bg-custom-purple-color px-8 py-3 text-lg text-white transition-all duration-300 ease-in-out hover:brightness-110`}
              style={{
                fontFamily: "DNFBitBitv2",
              }}
          >
            뒤로가기
          </button>
        </div>
      </div>
    </BaseModal>
*/
  );
};

export default FaceVerification;
