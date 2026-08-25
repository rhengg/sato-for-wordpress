import PremiumSmallSvg from "../../assets/icons/PremiumSmall.svg";
import UpgradeSvg from "../../assets/icons/Upgrade.svg";

type PremiumProps = {
  top?: string;
  width?: string;
  smIcon?: boolean;
};

const Premium = (props: PremiumProps) => {
  const { top, width, smIcon } = props;
  return (
    <img
      src={smIcon ? PremiumSmallSvg : UpgradeSvg}
      alt="premium Illustration"
      style={{ width: width ? `${width}px` : "90px", maxWidth: 380 }}
    />
  );
};

export default Premium;
