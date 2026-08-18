import React from "react";
import "./VideoQuota.css";
import { Text } from "@wordpress/ui";
import { readableSizeFromMB } from "../../utils/helper";

type VideoQuotaProps = {
  usedStorage: string;
  totalStorage: string;
  name: string;
  onChangePlanClick: () => void;
};

const VideoQuota: React.FC<VideoQuotaProps> = ({
  usedStorage,
  totalStorage,
  name,
  onChangePlanClick,
}) => {
  const storagePercentage =
    Number(totalStorage) > 0
      ? Math.min((Number(usedStorage) / Number(totalStorage)) * 100, 100)
      : 0;

  return (
    <div className="video-quota-container">
      <div className="video-quota-header">
        <div className="video-quota-text">
          <Text variant="body-sm">{`${name}: ${readableSizeFromMB(Number(usedStorage))}/${readableSizeFromMB(Number(totalStorage))}`}</Text>
        </div>
        <Text
          variant="body-md"
          className="sato-link"
          style={{ cursor: "pointer" }}
          onClick={onChangePlanClick}
        >
          Add More
        </Text>
      </div>
      <div className="video-quota-progress-bar">
        <div
          className="video-quota-progress-fill"
          style={{ width: `${storagePercentage}%` }}
        />
      </div>
    </div>
  );
};

export default VideoQuota;
