import React from "react";

type LivePlayerProps = {
  embedUrl: string;
};

const LivePlayer: React.FC<LivePlayerProps> = ({ embedUrl }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        aspectRatio: "16/9",
      }}
    >
      <iframe
        title="Sato Player"
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen
        src={embedUrl}
        style={{
          border: "none",
          outline: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
        }}
      ></iframe>
    </div>
  );
};

export default LivePlayer;
