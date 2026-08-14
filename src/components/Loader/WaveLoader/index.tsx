import React from "react";
import "./waveloader.css";

interface WaveLoaderProps {
  width?: number | string;
  height?: number | string;
}

const Index: React.FC<WaveLoaderProps> = ({
  width = "100%",
  height = "260px",
}) => {
  return (
    <div
      className="wave-loader"
      style={{
        width,
        height,
      }}
    />
  );
};

export default Index;
