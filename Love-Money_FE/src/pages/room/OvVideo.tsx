import React, { useEffect, useRef } from "react";
import { StreamManager } from "openvidu-browser";
import * as faceapi from "face-api.js";

interface OpenViduVideoComponentProps {
  streamManager: StreamManager;
}

const OvVideo: React.FC<OpenViduVideoComponentProps> = ({ streamManager }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        const canvas = canvasRef.current!;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };

        faceapi.matchDimensions(canvas, displaySize);

        const interval = setInterval(async () => {
          if (video.readyState === 4) {
            // Video is ready
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(
              detections,
              displaySize
            );
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              faceapi.draw.drawDetections(canvas, resizedDetections);
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

              // Log the expressions to the console
              detections.forEach((detection) => {
                console.log(detection.expressions);
              });
            }
          }
        }, 100);

        return () => clearInterval(interval);
      });
    }
  }, [streamManager]);

  return (
    <div className="relative">
      <video autoPlay={true} ref={videoRef} style={{ width: "100%" }} />
      <canvas ref={canvasRef} className="absolute left-0 top-0" />
    </div>
  );
};

export default OvVideo;
