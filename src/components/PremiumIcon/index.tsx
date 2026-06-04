import React from "react";

type PremiumProps = {
  top?: string;
  width?: string;
  smIcon?: boolean;
};

const Premium = (props: PremiumProps) => {
  const { top, width, smIcon } = props;
  return (
    <img
      src={smIcon ? "/PremiumSmall.svg" : "/Upgrade.svg"}
      alt="premium Illustration"
      style={{ width: width ? `${width}px` : "90px", maxWidth: 380 }}
    />
  );
};

export default Premium;
