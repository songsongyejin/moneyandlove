import React, { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";
import * as faceapi from "face-api.js";

const Test: React.FC = () => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [predictions, setPredictions] = useState<tmImage.Prediction[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gender, setGender] = useState<string>("male");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const photoRef = useRef<HTMLCanvasElement | null>(null);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);

  useEffect(() => {
    const loadModel = async () => {
      let baseURL = "";

      if (gender === "male") {
        baseURL += "male/";
      } else {
        baseURL += "female/";
      }

      const modelURL = baseURL + "model.json";
      const metadataURL = baseURL + "metadata.json";

      try {
        const tmModel = await tmImage.load(modelURL, metadataURL);
        setModel(tmModel);
        console.log("모델이 성공적으로 로드되었습니다.");
      } catch (error) {
        console.error("모델을 로드하는 중 오류가 발생했습니다.", error);
        alert(
          "모델을 로드하는 중 오류가 발생했습니다. model.json과 metadata.json 파일이 올바르게 위치해 있는지 확인하세요."
        );
      }
    };

    loadModel();
    loadFaceApiModels();
    startVideo();
  }, [gender]);

  const loadFaceApiModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play().catch((error) => {
              console.error("비디오 재생 중 오류 발생:", error);
            });
          };
        }
      })
      .catch((err) => {
        console.error("카메라 접근 중 오류 발생:", err);
      });
  };

  const takePhoto = async () => {
    const video = videoRef.current;
    const photo = photoRef.current;

    if (video && photo) {
      const width = 640;
      const height = 480;

      photo.width = width;
      photo.height = height;
      const ctx = photo.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const detections = await faceapi.detectAllFaces(
          photo,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (detections.length > 0) {
          const box = detections[0].box;
          const { x, y, width, height } = box;
          const imageData = ctx.getImageData(x, y, width, height);
          ctx.clearRect(0, 0, photo.width, photo.height);
          photo.width = width;
          photo.height = height;
          ctx.putImageData(imageData, 0, 0);
          setHasPhoto(true);

          if (model) {
            const imgElement = new Image();
            imgElement.src = photo.toDataURL();
            imgElement.onload = async () => {
              try {
                const prediction = await model.predict(imgElement);
                setPredictions(prediction);
                const score = calculateFinalScore(prediction);
                setFinalScore(score);
              } catch (error) {
                console.error("예측 중 오류 발생:", error);
              }
            };
          }
        } else {
          alert("얼굴을 감지하지 못했습니다.");
        }
      }
    }
  };

  const closePhoto = () => {
    const photo = photoRef.current;
    if (photo) {
      const ctx = photo.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, photo.width, photo.height);
        setHasPhoto(false);
        setPredictions([]);
        setFinalScore(null);
      }
    }
  };

  const calculateFinalScore = (predictions: tmImage.Prediction[]): number => {
    const weights: { [key: string]: number } = {
      "class 1": 1.0,
      "class 2": 0.9,
      "class 3": 0.7,
      "class 4": 0.6,
      "class 5": 0.5,
      "class 6": 0.4,
      "class 7": 0.1,
    };

    let weightedSum = 0;
    predictions.forEach((prediction) => {
      const weight = weights[prediction.className] || 0;
      weightedSum += prediction.probability * weight;
    });

    const finalScore = weightedSum * 100;

    return finalScore;
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  return (
    <div className="App">
      <h1>이미지 분류 웹 애플리케이션</h1>

      <h2>성별 선택</h2>
      <div>
        <input
          type="radio"
          id="female"
          name="gender"
          value="female"
          checked={gender === "female"}
          onChange={handleGenderChange}
        />
        <label htmlFor="female">여성</label>
        <input
          type="radio"
          id="male"
          name="gender"
          value="male"
          checked={gender === "male"}
          onChange={handleGenderChange}
        />
        <label htmlFor="male">남성</label>
      </div>

      <div className="camera">
        <video
          ref={videoRef}
          style={{
            width: "100%",
            maxWidth: "640px",
            border: "1px solid black",
          }}
        ></video>
        <button onClick={takePhoto}>Take Photo</button>
        {hasPhoto && <button onClick={closePhoto}>Close Photo</button>}
      </div>

      <canvas
        ref={photoRef}
        style={{
          display: hasPhoto ? "block" : "none",
          margin: "0 auto",
          border: "1px solid black",
        }}
      ></canvas>

      <div id="predictions" style={{ marginTop: "20px" }}>
        <h3>Predictions:</h3>
        <ul>
          {predictions.map((prediction, index) => (
            <li key={index}>
              {prediction.className}: {prediction.probability.toFixed(2)}
            </li>
          ))}
        </ul>
        {finalScore !== null && <p>종합 점수: {finalScore.toFixed(2)}</p>}
      </div>
    </div>
  );
};

export default Test;
