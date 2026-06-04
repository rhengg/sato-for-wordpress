import React from "react";
import "./colorpicker.css";
import Tooltip from "../Tooltip";

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

  // sync with parent
  React.useEffect(() => {
    setNewValue(value);
  }, [value]);

  const handleColorChange = (val: string) => {
    setNewValue(val);
    onChange?.(val);
  };

  const isTransparent = newValue === "transparent";

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
        <p className="body placeholder">{label}</p>
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
          gap: "0.5rem",
          padding: "0.05rem 0.5rem",
          borderRadius: "0.25rem",
          border: "1px solid #585858",
          backgroundColor: "var(--white)",
          opacity: isTransparent ? 0.5 : 1,
          // width: "11rem",
        }}
      >
        {/* Color input */}
        <input
          className="color-picker-input"
          type="color"
          name={name}
          value={isTransparent ? "#000000" : newValue}
          onChange={(e) => {
            handleColorChange(e.target.value); // this will override transparent
          }}
        />

        {/* Hex / transparent text input */}
        <input
          className="color-hex-input body"
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

        {/* Transparent toggle */}
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
          }}
        >
          {isTransparent ? (
            <img
              src={"/hide.svg"}
              alt="unhide Illustration"
              style={{ width: "18px", height: "18px" }}
              loading="lazy"
            />
          ) : (
            <img
              src={"/unhide.svg"}
              alt="hide Illustration"
              style={{ width: "18px", height: "18px" }}
              loading="lazy"
            />
          )}
          {/* ⦸ */}
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
