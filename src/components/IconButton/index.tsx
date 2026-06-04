import React from "react";
import "./iconbutton.css";

type IconButtonProps = {
  children?: React.ReactElement;
  onClick?: any;
  width?: string;
  height?: string;
};

const Index = (props: IconButtonProps) => {
  const { onClick, children, height, width } = props;
  return (
    <div
      className="icon-button-container"
      style={{ width: width || "2rem", height: height || "2rem" }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Index;
