// import SkaraPlayer, { PlayerConfig } from "@skara-live/skara-video-player-web";
// import React from "react";

// type LivePlayerProps = {
//   config: PlayerConfig;
// };

// class LivePlayer extends React.Component<LivePlayerProps> {
//   private player: SkaraPlayer | null = null;
//   private playerRef = React.createRef<HTMLDivElement>();

//   componentDidMount() {
//     this.initializePlayer();
//   }

//   componentDidUpdate(prevProps: LivePlayerProps) {
//     if (prevProps.config !== this.props.config) {
//       console.log("consss", this.props.config);

//       this.setState({ config: this.props.config });
//       this.player?.dispose();
//       this.initializePlayer();
//     }
//   }

//   componentWillUnmount() {
//     console.log("yyyyyyyyyyyyyy");

//     this.player?.dispose();
//   }

//   initializePlayer() {
//     if (!this.playerRef.current) return;
//     console.log("xxxxxxxxxxxxxxxx", this.props.config);

//     this.player = new SkaraPlayer(this.playerRef.current, this.props.config);

//     this.player.start();
//   }

//   render() {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           width: "100%",
//           aspectRatio: "16/9",
//         }}
//       >
//         <div ref={this.playerRef} style={{ width: "100%", height: "100%" }} />
//       </div>
//     );
//   }
// }

// export default LivePlayer;

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

    // console.log("Initializing with config:", config);

    // Clear previous DOM (important)
    playerRef.current.innerHTML = "";

    // Deep clone to avoid mutation issues
    const freshConfig = structuredClone(config);

    playerInstance.current = new SkaraPlayer(playerRef.current, freshConfig);

    // console.log("freshConfig", freshConfig);

    playerInstance.current.start();
  };

  useEffect(() => {
    initializePlayer();

    return () => {
      playerInstance.current?.dispose();
      playerInstance.current = null;
    };
  }, [config]); // Re-run when config changes

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
