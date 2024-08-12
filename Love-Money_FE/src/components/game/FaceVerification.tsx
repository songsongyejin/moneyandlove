import React, { useState, useEffect } from "react";
import BaseModal from "../home/BaseModal";
import * as tmImage from '@teachablemachine/image';
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
  const [finalScore, setFinalScore] = useState<number | null>(null); // 종합 점수를 저장할 상태
  const [model, setModel] = useState<any>(null);
  const [user] = useRecoilState(userInfo);

  useEffect(() => {
    if (isOpen) {
      initModel();
    } else {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setImagePreview(null);
    setFinalScore(null);
    setModel(null);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (event) {
      const imageDataUrl = event.target?.result as string;
      setImagePreview(imageDataUrl);

      setTimeout(() => {
        const imgElement = document.getElementById('image-preview') as HTMLImageElement | null;
        if (imgElement) {
          imgElement.src = imageDataUrl;

          if (model) {
            imgElement.onload = async () => {
              const prediction = await model.predict(imgElement);
              const finalScore = calculateFinalScore(prediction);
              setFinalScore(finalScore); // 종합 점수를 상태에 저장하고 화면에 표시
            };
          }
        } else {
          console.error('Image element not found');
        }
      }, 100); // Delay to ensure the img element is rendered
    };
    reader.readAsDataURL(file);
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
      alert("이미지를 업로드해 주세요.");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="얼굴 인증">
      <div className="flex flex-col items-center">
        <p className="mb-6 text-center text-lg">
          인증되지 않은 사용자는 첫 인증 후 play 할 수 있습니다.
        </p>
        <input
          type="file"
          id="upload-image"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        {imagePreview && (
          <img
            id="image-preview"
            src={imagePreview}
            alt="Image Preview"
            className="mb-4 max-w-xs max-h-xs"
          />
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
