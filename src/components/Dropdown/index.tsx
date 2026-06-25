import React from "react";
import "./dropdown.css";
import Tooltip from "../Tooltip";
import Premium from "../PremiumIcon";
import { Button, DropdownMenu } from "@wordpress/components";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
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
  tooltipText,
  options = [],
  disabled,
}: DropdownProps) => {
  const [newValue, setNewValue] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === newValue);

  const handleChange = (val: string) => {
    setNewValue(val);
    onChange?.(val);
  };

  React.useEffect(() => {
    setNewValue(value);
  }, [value]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      </div>

      {/* Dropdown */}
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <Button
          ref={wrapperRef}
          __next40pxDefaultSize={true}
          type="button"
          disabled={disabled}
          variant="secondary"
          icon={"arrow-down"}
          style={{
            width: "9.25rem",
            height: "100%",
            justifyContent: "space-between",
          }}
          iconPosition="right"
          onClick={() => setOpen((prev) => !prev)}
        >
          {selectedOption?.label ?? "Select"}
        </Button>

        {open && (
          <ul
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              margin: 0,
              padding: "0.25rem 0",
              listStyle: "none",
              background: "var(--white)",
              border: "1px solid #585858",
              borderRadius: "0.25rem",
              boxShadow: "0 2px 8px rgba(0,0,0,.15)",
              zIndex: 1000,
            }}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  handleChange(opt.value);
                  setOpen(false);
                }}
                className="dropdown-option body"
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
