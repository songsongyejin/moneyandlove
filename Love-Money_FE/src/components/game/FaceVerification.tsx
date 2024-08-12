import React, { useState, useEffect, useRef } from "react";
import BaseModal from "../home/BaseModal";
import * as tmImage from '@teachablemachine/image';
import * as tf from '@tensorflow/tfjs'; // 명시적으로 tfjs를 import
import * as faceapi from 'face-api.js';
import { userInfo } from "../../atom/store";
import { useRecoilState } from "recoil";

interface FaceVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({
  isOpen,
  onClose,
  onVerificationComplete,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null); // 추출된 얼굴 이미지를 저장할 상태
  const [finalScore, setFinalScore] = useState<number | null>(null); // 종합 점수를 저장할 상태
  const [model, setModel] = useState<any>(null);
  const [user] = useRecoilState(userInfo);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      initModel();
      loadFaceApiModels();
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen]);

  const resetState = () => {
    setImagePreview(null);
    setFacePreview(null);
    setFinalScore(null);
    setModel(null);
  };

  const loadFaceApiModels = async () => {
    // face-api.js 모델 로드
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models'); // face detection model
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models'); // landmark model
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models'); // face recognition model
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
      console.error("Unknown gender or gender is not set. Defaulting to female model.");
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
      alert("모델을 로드하는 중 오류가 발생했습니다. model.json과 model.weights.bin 파일이 올바르게 위치해 있는지 확인하세요.");
    }
  };

  const startCamera = async () => {
    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        const imageDataUrl = canvasRef.current.toDataURL("image/png");
        setImagePreview(imageDataUrl);
        processImage(imageDataUrl);
      }
    }
  };

  const processImage = async (imageDataUrl: string) => {
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
            const newWidth = Math.min(box.width + 2 * paddingSides, imgElement.width - newX);
            const newHeight = Math.min(box.height + paddingTop + paddingBottom, imgElement.height - newY);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx.drawImage(imgElement, newX, newY, newWidth, newHeight, 0, 0, newWidth, newHeight);

              const faceDataUrl = canvas.toDataURL();
              setFacePreview(faceDataUrl); // 추출한 얼굴 이미지를 저장

              const faceImg = new Image();
              faceImg.src = faceDataUrl;
              faceImg.onload = async () => {
                tf.tidy(() => {
                  model.predict(faceImg).then((prediction: any) => {
                    const finalScore = calculateFinalScore(prediction);
                    setFinalScore(finalScore);
                  });
                });
              };
            }
          } else {
            alert("얼굴을 감지하지 못했습니다. 다시 시도해 주세요.");
          }
        } else {
          console.error('Model not loaded');
        }
      };
    }, 100); // Delay to ensure the img element is rendered
  };

  const calculateFinalScore = (predictions: any) => {
    const weights: { [key: string]: number } = {
      "1": 1.0,
      "2": 0.9,
      "3": 0.7,
      "4": 0.6,
      "5": 0.5,
      "6": 0.4,
      "7": 0.1
    };

    let weightedSum = 0;
    predictions.forEach((prediction: any) => {
      const weight = weights[prediction.className] || 0;
      weightedSum += prediction.probability * weight;
    });

    const finalScore = weightedSum * 100;
    return finalScore;
  };

  const handleVerification = () => {
    if (imagePreview) {
      onVerificationComplete();
    } else {
      alert("사진을 촬영해 주세요.");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="얼굴 인증">
      <div className="flex flex-col items-center">
        <p className="mb-6 text-center text-lg">
          인증되지 않은 사용자는 첫 인증 후 play 할 수 있습니다.
        </p>
        <div className="mb-4">
          <video ref={videoRef} className="mb-4 max-w-xs max-h-xs" />
          <button
            onClick={captureImage}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            사진 촬영
          </button>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {imagePreview && (
          <div className="mb-4">
            <p>원본 이미지:</p>
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
            <p>추출된 얼굴 이미지:</p>
            <img
              id="face-preview"
              src={facePreview}
              alt="Face Preview"
              className="mb-4 max-w-xs max-h-xs"
            />
          </div>
        )}

        {finalScore !== null && (
          <div className="mb-4">
            <p>종합 점수: {finalScore.toFixed(2)}</p> {/* 종합 점수만 표시 */}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleVerification}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            인증하기
          </button>
          <button
            onClick={() => {
              onClose();
              resetState(); // 모달을 닫을 때 상태를 초기화
            }}
            className="rounded bg-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-400"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default FaceVerification;
