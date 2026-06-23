import React from "react";
import "./VideoQuota.css";
import { Text, Link } from "@wordpress/ui";

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
        <div className="video-quota-text">
          <Text variant="body-lg">{`Usage: ${used}/${total} videos`}</Text>
          <Text variant="body-lg"> | </Text>
          <Text variant="body-lg">{`${maxSize} MB/video`}</Text>
        </div>
        <Link className="sato-link" href="#" variant="unstyled">
          <Text variant="heading-lg">Change Plan</Text>
        </Link>
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
