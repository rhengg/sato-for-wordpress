import React from "react";
import "./VideoQuota.css";

type VideoQuotaProps = {
  used: number;
  total: number;
  maxSize: string;
  onUpgradeClick: () => void;
};

const VideoQuota: React.FC<VideoQuotaProps> = ({
  used,
  total,
  maxSize,
  onUpgradeClick,
}) => {
  const percentage = (used / total) * 100;

  return (
    <div className="video-quota-container">
      <div className="video-quota-header">
        <span>{`Usage: ${used}/${total} videos`}</span>
        <span className="divider">|</span>
        <span>{`${maxSize} MB/video`}</span>
        <span className="upgrade-plan" onClick={onUpgradeClick}>
          Change Plan
        </span>
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
