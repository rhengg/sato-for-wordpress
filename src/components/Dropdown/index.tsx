import React from "react";
import "./dropdown.css";
import Tooltip from "../Tooltip";
import Premium from "../PremiumIcon";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  name?: string;
  value?: string;
  onChange: (val: string) => void;
  label?: string;
  tooltipText?: string;
  options: Option[];
  disabled?: boolean;
};

const Dropdown = ({
  value = "",
  onChange,
  label,
  name,
  tooltipText,
  options = [],
  disabled,
}: DropdownProps) => {
  const [newValue, setNewValue] = React.useState(value);

  // sync with parent
  React.useEffect(() => {
    setNewValue(value);
  }, [value]);

  const handleChange = (val: string) => {
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
      {/* Label + tooltip */}
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
        {/* <div style={{ position: "relative" }}>
          {disabled && <Premium top="0%" />}
        </div> */}
      </div>

      {/* Dropdown */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0 0.5rem",
          borderRadius: "0.25rem",
          border: "1px solid #585858",
          backgroundColor: "var(--white)",
          width: "9.25rem",
        }}
      >
        <select
          className="dropdown-input body"
          name={name}
          value={newValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Dropdown;
