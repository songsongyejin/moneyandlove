import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
import React, { useState, useEffect, useRef } from "react";
import BaseModal from "../home/BaseModal";

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
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      tf.setBackend("cpu") // Backend를 CPU로 설정합니다.
        .then(() => tf.ready()) // 백엔드가 준비될 때까지 기다립니다.
        .then(() => initModel());
    }
  }, [isOpen, selectedGender]);

  const initModel = async () => {
    let baseURL = "/";

    const gender = localStorage.getItem('gender') || selectedGender;
    if (gender === "male") {
      baseURL += "male/";
    } else if (gender === "female") {
      baseURL += "female/";
    }

    const modelURL = baseURL + "model.json";
    const metadataURL = baseURL + "metadata.json";

    try {
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
    } catch (error) {
      console.error("모델을 로드하는 중 오류가 발생했습니다.", error);
      alert("모델을 로드하는 중 오류가 발생했습니다. model.json과 model.weights.bin 파일이 올바르게 위치해 있는지 확인하세요.");
    }
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const gender = event.target.value;
    setSelectedGender(gender);
    localStorage.setItem('gender', gender);
    initModel();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;
    console.log("?>??SD?SAD?AS?DFA?SED?")

    const reader = new FileReader();
    reader.onload = async function (event) {
      console.log("여기?"+ imgElementRef.current)
      if (imgElementRef.current) { 
        imgElementRef.current.src = event.target?.result as string;
        setImagePreview(event.target?.result as string);

        console.log("이미지 로드 중...");
        imgElementRef.current.onload = async () => {
          if (model) {
            console.log("이미지 로드 완료, 예측 시작");
            
            try {
              const prediction = await model.predict(imgElementRef.current!);
              console.log("예측 결과:", prediction);
              displayPrediction(prediction);
            } catch (error) {
              console.error("예측 중 오류 발생:", error);
              alert("예측 중 오류가 발생했습니다. 다시 시도해 주세요.");
            }
          } else {
            console.error("모델이 로드되지 않았습니다.");
            alert("모델이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
          }
        };
      }
    };
    reader.readAsDataURL(file);
  };


  const displayPrediction = (predictions: any[]) => {
    const predictionTexts: string[] = [];

    predictions.forEach((prediction) => {
      const classPrediction = `${prediction.className}: ${prediction.probability.toFixed(2)}`;
      predictionTexts.push(classPrediction);
    });

    setPredictions(predictionTexts);

    const finalScore = calculateFinalScore(predictions);
    console.log("종합 점수:", finalScore.toFixed(2));
  };

  const calculateFinalScore = (predictions: any[]) => {
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
    predictions.forEach((prediction) => {
      const weight = weights[prediction.className] || 0;
      weightedSum += prediction.probability * weight;
    });

    const finalScore = weightedSum * 100;
    return finalScore;
  };

  const handleVerification = () => {
    if (selectedGender && imagePreview) {
      onVerificationComplete();
    } else {
      alert("성별을 선택하고 이미지를 업로드해 주세요.");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="얼굴 인증">
      <div className="flex flex-col items-center">
        <p className="mb-6 text-center text-lg">
          인증되지 않은 사용자는 첫 인증 후 play 할 수 있습니다.
        </p>

        <h2 className="text-lg mb-4">성별 선택</h2>
        <div className="flex mb-4 space-x-4">
          <label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              onChange={handleGenderChange}
              className="mr-2"
            />
            여성
          </label>
          <label>
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              onChange={handleGenderChange}
              className="mr-2"
            />
            남성
          </label>
        </div>

        <input
          type="file"
          id="upload-image"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        {imagePreview && (
          <img
            ref={imgElementRef}
            id="image-preview"
            src={imagePreview}
            alt="Image Preview"
            className="mb-4 max-w-xs max-h-xs"
          />
        )}

        <div id="predictions" className="mb-4">
          {predictions.length > 0 ? predictions.map((prediction, index) => (
            <p key={index}>{prediction}</p>
          )) : <p>예측 결과가 없습니다. 이미지를 업로드해 주세요.</p>}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleVerification}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            인증하기
          </button>
          <button
            onClick={onClose}
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
