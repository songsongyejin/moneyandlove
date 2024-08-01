import React, { useEffect, useRef, useState } from "react";
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
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      console.log("Models loaded");
    };

    loadModels();

    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
      videoRef.current.addEventListener("play", () => {
        const video = videoRef.current!;
        let noFaceDetectedTimeout: NodeJS.Timeout | null = null;

        const handleVideoPlay = () => {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            if (streamManager.stream.streamManager.accessAllowed) {
              const displaySize = {
                width: video.videoWidth,
                height: video.videoHeight,
              };

              faceapi.matchDimensions(video, displaySize);

              const interval = setInterval(async () => {
                if (video.readyState === 4) {
                  // Video is ready
                  const detections = await faceapi
                    .detectAllFaces(
                      video,
                      new faceapi.TinyFaceDetectorOptions()
                    )
                    .withFaceLandmarks()
                    .withFaceExpressions();
                  const resizedDetections = faceapi.resizeResults(
                    detections,
                    displaySize
                  );

                  if (resizedDetections.length === 0) {
                    if (!noFaceDetectedTimeout) {
                      noFaceDetectedTimeout = setTimeout(() => {
                        setWarningMsg(
                          "얼굴 인식이 되지 않았습니다. \n정면을 응시해주세요!!! \n표정이 인식되면 채팅장이 공개됩니다!!!"
                        );
                      }, 1000);
                    }
                  } else {
                    // 얼굴이 인식되었을 때 경고 메시지 제거
                    if (noFaceDetectedTimeout) {
                      clearTimeout(noFaceDetectedTimeout);
                      noFaceDetectedTimeout = null;
                    }
                    setWarningMsg("");

                    // Find the maximum expression value
                    let maxExpression = "";
                    let maxValue = 0;
                    resizedDetections.forEach((detection) => {
                      const expressions = detection.expressions as any;
                      for (let [expression, value] of Object.entries(
                        expressions
                      )) {
                        if (typeof value === "number" && value > maxValue) {
                          maxValue = value;
                          maxExpression = expression;
                        }
                      }
                    });
                    setMaxExpression(maxExpression);
                  }
                }
              }, 100);

              return () => clearInterval(interval);
            }
          } else {
            requestAnimationFrame(handleVideoPlay);
          }
        };

        requestAnimationFrame(handleVideoPlay);
      });
    }
  }, [streamManager, setMaxExpression]);

  return (
    <div className="flex flex-col items-center justify-center">
      <video autoPlay={true} ref={videoRef} style={{ width: "90%" }} />
    </div>
  );
};

export default OvVideo;
