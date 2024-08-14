import React, { useEffect, useRef, useState } from "react";
import { StreamManager } from "openvidu-browser";

interface OpenViduVideoComponentProps {
  streamManager: StreamManager;
}

const OvVideo: React.FC<OpenViduVideoComponentProps> = ({ streamManager }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      console.log(videoRef);
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div className="flex flex-col items-center justify-center">
      <video autoPlay={true} ref={videoRef} style={{ width: "90%" }} />
    </div>
  );
};

export default OvVideo;
