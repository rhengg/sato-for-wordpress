import "./toggle.css";
import Tooltip from "../Tooltip";
import Premium from "../PremiumIcon";

type ToggleProps = {
  name?: string;
  checked?: boolean;
  onChange: any;
  label?: string;
  tooltipText?: string;
  disabled?: boolean;
  showCaptions?: boolean;
  premiumModalTitle?: any;
  onPremiumClick?: (v: any) => void;
};

const Toggle = ({
  checked,
  onChange,
  label,
  name,
  tooltipText,
  disabled,
  showCaptions = false,
  onPremiumClick,
  premiumModalTitle,
}: ToggleProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingBottom: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.25rem",
          position: "relative",
        }}
      >
        <p className="satoBody satoPlaceholder">{label}</p>
        {tooltipText && (
          <div
            style={{
              position: "relative",
            }}
          >
            <Tooltip text={tooltipText as string}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                info
              </span>
            </Tooltip>
          </div>
        )}
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            onPremiumClick?.(premiumModalTitle);
          }}
        >
          {disabled && showCaptions && <Premium top="0%" />}
        </div>
      </div>

      <label className="toggle-container">
        <input
          name={name}
          className="toggle-button"
          type="checkbox"
          disabled={disabled}
          defaultChecked={checked}
          checked={checked}
          onClick={onChange}
        />
        <span
          className="toggle-circle"
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        ></span>
      </label>
    </div>
  );
};

export default Toggle;
