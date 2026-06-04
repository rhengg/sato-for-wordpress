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
    if (name?.includes("margin")) {
      return <span className="material-symbols-outlined">padding</span>;
    }
    if (name?.includes("opacity")) {
      return <span className="material-symbols-outlined">opacity</span>;
    }
    if (name?.includes("padding")) {
      return <span className="material-symbols-outlined">padding</span>;
    }
    if (name?.includes("radius")) {
      return <span className="material-symbols-outlined">rounded_corner</span>;
    }
    if (name?.includes("spacing")) {
      return <span className="material-symbols-outlined">toast</span>;
    }
    if (name?.includes("size")) {
      return <span className="material-symbols-outlined">arrows_output</span>;
    }
    if (name?.includes("height")) {
      return <span className="material-symbols-outlined">height</span>;
    }
    if (name?.includes("scale")) {
      return <span className="material-symbols-outlined">expand</span>;
    }
  };

  const renderUnit = () => {
    if (name?.includes("scale")) {
      return <p className="label">x</p>;
    } else if (name?.includes("opacity")) {
      return <p className="label">%</p>;
    } else {
      return <p className="label">px</p>;
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
        <p className="body placeholder">{label}</p>
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
          justifyContent: "flex-start",
          gap: "0.5rem",
          padding: "0 0.5rem",
          borderRadius: "0.25rem",
          border: "1px solid #585858",
          width: "9.25rem",
          backgroundColor: "var(--white)",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {rendericon()}

        <input
          className="size-input body"
          type="number"
          name={name}
          // defaultValue={value}
          value={value ?? ""}
          min={"0"}
          max={"300"}
          step={"any"}
          disabled={disabled}
          // value={value}
          // onChange={onChange}
          // onInput={onChange}
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
