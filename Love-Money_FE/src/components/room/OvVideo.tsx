import React, { useEffect, useRef } from "react";
import { StreamManager } from "openvidu-browser";
import * as faceapi from "face-api.js";
import { useRecoilState } from "recoil";
import { maxExpressionState, warning } from "../../atom/store";

interface OpenViduVideoComponentProps {
  streamManager: StreamManager;
}

const OvVideo: React.FC<OpenViduVideoComponentProps> = ({ streamManager }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [maxExpression, setMaxExpression] = useRecoilState(maxExpressionState);
  const [warningMsg, setWarningMsg] = useRecoilState(warning);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    };

    const analyzeExpressions = async () => {
      if (videoRef.current) {
        const video = videoRef.current;
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detection) {
          const expressions = detection.expressions;
          const maxExpressionKey = Object.keys(expressions).reduce((a, b) =>
            expressions[a as keyof faceapi.FaceExpressions] >
            expressions[b as keyof faceapi.FaceExpressions]
              ? a
              : b
          ) as keyof faceapi.FaceExpressions;
          setMaxExpression(maxExpressionKey);
          setWarningMsg(""); // Clear any previous warning messages
        } else {
          setWarningMsg("Face or expression not detected. Please try again.");
        }
      }
    };

    loadModels().then(() => {
      if (streamManager && videoRef.current) {
        streamManager.addVideoElement(videoRef.current);
        const intervalId = setInterval(analyzeExpressions, 100); // Analyze expressions every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
      }
    });
  }, [streamManager, setMaxExpression, setWarningMsg]);

  return (
    <div className="flex flex-col items-center justify-center">
      <video autoPlay={true} ref={videoRef} style={{ width: "90%" }} />
    </div>
  );
};

export default OvVideo;
