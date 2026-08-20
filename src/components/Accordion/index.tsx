import React from "react";
import "./accordion.css";
import Premium from "../PremiumIcon";
import { useNavigate } from "react-router-dom";

type AccordionProps = {
  handleToggle: (id: string) => void;
  active: string[];
  header: string;
  children: React.ReactNode;
  id: string;
  icon?: string;
  premium?: boolean;
  premiumModalTitle?: any;
  onPremiumClick?: (v: any) => void;
};

const Accordion: React.FC<AccordionProps> = ({
  handleToggle,
  active,
  header,
  children,
  id,
  icon,
  premium,
  premiumModalTitle,
  onPremiumClick,
}) => {
  const contentEl = React.useRef<HTMLDivElement>(null);
  const isActive = active.includes(id);
  const [height, setHeight] = React.useState("0px");

  React.useEffect(() => {
    if (isActive && contentEl.current) {
      setHeight(`${contentEl.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isActive]);

  return (
    <div className="accordion-card" style={{ opacity: premium ? "0.8" : "1" }}>
      <div className="accordion-header">
        <div
          className={`accordion-toggle ${isActive ? "active" : ""}`}
          onClick={() => handleToggle(id)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {icon && (
              <span
                className="material-symbols-outlined"
                style={{
                  color: "var(--satoTextSecondary)",
                  fontWeight: "bold",
                }}
              >
                {icon}
              </span>
            )}
            <p className="satoBody satoTextSecondary">{header}</p>
            {premium && (
              <div
                style={{ display: "flex", alignItems: "center" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPremiumClick?.(premiumModalTitle);
                }}
              >
                <Premium />
              </div>
            )}
          </div>
          <span
            className="material-symbols-outlined accordion-icon"
            style={{ fontWeight: "bold" }}
          >
            keyboard_arrow_up
          </span>
        </div>
      </div>
      <div
        ref={contentEl}
        className={`collapse ${isActive ? "show" : ""}`}
        style={{ height, overflow: "hidden", transition: "height 0.3s ease" }}
      >
        <div className="accordion-satoBody">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
