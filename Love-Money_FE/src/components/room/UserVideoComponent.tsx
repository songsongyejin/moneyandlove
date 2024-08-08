import React from "react";
import { StreamManager } from "openvidu-browser";
import OpenViduVideoComponent from "./OvVideo";

interface UserVideoComponentProps {
  streamManager: StreamManager;
}

const UserVideoComponent: React.FC<UserVideoComponentProps> = ({
  streamManager,
}) => {
  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {streamManager !== undefined ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
          <div className="my-5 h-0.5 bg-gray-500"></div>
          <div>
            <p
              className="text-center text-xl text-custom-purple-color"
              style={{ fontFamily: "DungGeunMo" }}
            >
              {getNicknameTag()}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;
