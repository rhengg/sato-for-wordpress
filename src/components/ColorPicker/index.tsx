import React from "react";
import "./colorpicker.css";
import Tooltip from "../Tooltip";
import hideSvg from "../../assets/hide.svg";
import unhideSvg from "../../assets/unhide.svg";
import { ColorPicker as WpColorPicker } from "@wordpress/components";
import PortalPopover from "../PortalPopover";

type ColorPickerProps = {
  name?: string;
  value?: string;
  onChange: (val: string) => void;
  label?: string;
  tooltipText?: string;
};

const ColorPicker = ({
  value = "#000000",
  onChange,
  label,
  name,
  tooltipText,
}: ColorPickerProps) => {
  const [newValue, setNewValue] = React.useState(value);
  const isTransparent = newValue === "transparent";

  React.useEffect(() => {
    setNewValue(value);
  }, [value]);

  const handleColorChange = (val: string) => {
    setNewValue(val);
    onChange?.(val);
  };

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
          alignItems: "center",
          gap: "0.25rem",
          position: "relative",
        }}
      >
        <p className="satoBody satoPlaceholder">{label}</p>
        {tooltipText && (
          <Tooltip text={tooltipText}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px", cursor: "pointer" }}
            >
              info
            </span>
          </Tooltip>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: "0.25rem",
          border: "1px solid #585858",
          backgroundColor: "var(--white)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "25px",
            padding: "0.05rem 0.25rem",
          }}
        >
          <PortalPopover
            position="top"
            trigger={
              <div
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  borderRadius: "0.25rem",
                  border: "1px solid var(--strokeSecondary)",
                  background: isTransparent
                    ? `
              linear-gradient(
                to right,
                rgba(0, 0, 0, 0.8),
                rgba(0, 0, 0, 0)
              ),
              linear-gradient(45deg, #d0d0d0 25%, transparent 25%),
              linear-gradient(-45deg, #d0d0d0 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #d0d0d0 75%),
              linear-gradient(-45deg, transparent 75%, #d0d0d0 75%)
            `
                    : newValue,
                  backgroundSize: isTransparent
                    ? "100% 100%, 10px 10px, 10px 10px, 10px 10px, 10px 10px"
                    : "auto auto",
                  backgroundPosition: isTransparent
                    ? "0 0, 0 0, 0 5px, 5px -5px, -5px 0"
                    : "0% 0%",
                }}
              />
            }
          >
            <WpColorPicker
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0 0 0 1px #ccc, 0 2px 3px #0000000d, 0 4px 5px #0000000a, 0 12px 12px #00000008, 0 16px 16px #00000005",
                borderRadius: "0.25rem",
                boxSizing: "border-box",
              }}
              color={isTransparent ? "#000000" : newValue}
              onChange={handleColorChange}
              enableAlpha
            />
          </PortalPopover>
        </div>

        <input
          className="color-hex-input satoBody"
          name={name}
          value={newValue}
          onChange={(e) => {
            const val = e.target.value.trim();

            if (val.toLowerCase() === "transparent") {
              handleColorChange("transparent");
            } else {
              const raw = val.replace(/^#+/, "");
              handleColorChange(raw ? "#" + raw : "");
            }
          }}
          maxLength={12}
        />

        <button
          type="button"
          className="transparent-btn"
          onClick={() =>
            handleColorChange(isTransparent ? "#000000" : "transparent")
          }
          title="Toggle transparent"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1.5rem",
          }}
        >
          {isTransparent ? (
            <img
              src={hideSvg}
              alt="unhide Illustration"
              style={{ width: "18px", height: "18px" }}
              loading="lazy"
            />
          ) : (
            <img
              src={unhideSvg}
              alt="hide Illustration"
              style={{ width: "18px", height: "18px" }}
              loading="lazy"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
