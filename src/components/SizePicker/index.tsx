import React from "react";
import "./sizepicker.css";
import Tooltip from "../Tooltip";

type SizePickerProps = {
  name?: string;
  value?: string;
  onChange?: any;
  label?: string;
  tooltipText?: string;
  disabled?: boolean;
};

const Index = (props: SizePickerProps) => {
  const { label, name, value, onChange, tooltipText, disabled } = props;

  const rendericon = () => {
    const icons: Record<string, string> = {
      margin: "padding",
      opacity: "opacity",
      padding: "padding",
      radius: "rounded_corner",
      spacing: "toast",
      size: "arrows_output",
      height: "height",
      scale: "expand",
    };

    const icon = Object.entries(icons).find(([key]) =>
      name?.includes(key),
    )?.[1];

    return icon ? (
      <span
        className="material-symbols-outlined"
        style={{ width: "25px", padding: "0.05rem 0.25rem" }}
      >
        {icon}
      </span>
    ) : null;
  };

  const renderUnit = () => {
    if (name?.includes("scale")) {
      return (
        <p className="satoLabel" style={{ width: "1.5rem" }}>
          x
        </p>
      );
    } else if (name?.includes("opacity")) {
      return (
        <p className="satoLabel" style={{ width: "1.5rem" }}>
          %
        </p>
      );
    } else {
      return (
        <p className="satoLabel" style={{ width: "1.5rem" }}>
          px
        </p>
      );
    }
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
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: "0.25rem",
          border: "1px solid #585858",
          backgroundColor: "var(--white)",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {rendericon()}

        <input
          className="size-input satoBody"
          type="number"
          name={name}
          value={value ?? ""}
          min={"0"}
          max={"300"}
          step={"any"}
          disabled={disabled}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value.length > 3) {
              e.target.value = e.target.value.slice(0, 3);
            }
            if (+e.target.value > 300) {
              e.target.value = "300";
            }
            onChange?.(e);
          }}
        />

        {renderUnit()}
      </div>
    </div>
  );
};

export default Index;
