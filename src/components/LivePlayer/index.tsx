import React, { useEffect, useRef } from "react";
import SkaraPlayer, { PlayerConfig } from "@skara-live/skara-video-player-web";

type LivePlayerProps = {
  config: PlayerConfig;
};

const LivePlayer: React.FC<LivePlayerProps> = ({ config }) => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const playerInstance = useRef<SkaraPlayer | null>(null);

  const initializePlayer = () => {
    if (!playerRef.current) return;
    playerRef.current.innerHTML = "";
    const freshConfig = structuredClone(config);
    playerInstance.current = new SkaraPlayer(playerRef.current, freshConfig);
    playerInstance.current.start();
  };

  useEffect(() => {
    initializePlayer();

    return () => {
      playerInstance.current?.dispose();
      playerInstance.current = null;
    };
  }, [config]);

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
      <div ref={playerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default LivePlayer;
