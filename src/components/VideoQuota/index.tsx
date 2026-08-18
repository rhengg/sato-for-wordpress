import React from "react";
import "./VideoQuota.css";
import { Text } from "@wordpress/ui";
import { readableSizeFromMB } from "../../utils/helper";

type VideoQuotaProps = {
  used: string;
  total: string;
  name: string;
  maxSizePerVideo?: string;
  onChangePlanClick: () => void;
};

const VideoQuota: React.FC<VideoQuotaProps> = ({
  used,
  total,
  name,
  maxSizePerVideo,
  onChangePlanClick,
}) => {
  const totalPercentage =
    Number(total) > 0 ? Math.min((Number(used) / Number(total)) * 100, 100) : 0;

  return (
    <div className="video-quota-container">
      <div className="video-quota-header">
        <div className="video-quota-text">
          {/* <Text variant="body-sm">{`${name}: ${readableSizeFromMB(Number(usedStorage))}/${readableSizeFromMB(Number(totalStorage))}`}</Text> */}

          <Text variant="body-sm" style={{ display: "inline-block" }}>
            {name}:
          </Text>
          {maxSizePerVideo ? (
            <Text variant="body-sm" style={{ display: "inline-block" }}>
              {used}/{total} videos |{" "}
              {readableSizeFromMB(Number(maxSizePerVideo))}/video
            </Text>
          ) : (
            <Text variant="body-sm" style={{ display: "inline-block" }}>
              {readableSizeFromMB(Number(total))} |{" "}
              {parseInt(totalPercentage.toString())}% used
            </Text>
          )}
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
          style={{ width: `${totalPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default VideoQuota;
