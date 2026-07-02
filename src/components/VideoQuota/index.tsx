import React from "react";
import "./VideoQuota.css";
import { Text } from "@wordpress/ui";

type VideoQuotaProps = {
  used: number;
  total: number;
  maxSize: string;
  onChangePlanClick: () => void;
};

const VideoQuota: React.FC<VideoQuotaProps> = ({
  used,
  total,
  maxSize,
  onChangePlanClick,
}) => {
  const percentage = (used / total) * 100;

  return (
    <div className="video-quota-container">
      <div className="video-quota-header">
        <div className="video-quota-text">
          <Text variant="body-lg">{`Usage: ${used}/${total} videos`}</Text>
          <Text variant="body-lg"> | </Text>
          <Text variant="body-lg">{`${maxSize} MB/video`}</Text>
        </div>
        <Text
          variant="heading-lg"
          className="sato-link"
          style={{ cursor: "pointer" }}
          onClick={onChangePlanClick}
        >
          Change Plan
        </Text>
      </div>
      <div className="video-quota-progress-bar">
        <div
          className="video-quota-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default VideoQuota;
