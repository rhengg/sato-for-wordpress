import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = "top",
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    transform: "",
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = () => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const gap = 8;

    switch (position) {
      case "bottom":
        setCoords({
          top: rect.bottom + gap,
          left: rect.left + rect.width / 2,
          transform: "translateX(-50%)",
        });
        break;

      case "left":
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.left - gap,
          transform: "translate(-100%, -50%)",
        });
        break;

      case "right":
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.right + gap,
          transform: "translateY(-50%)",
        });
        break;

      case "top":
      default:
        setCoords({
          top: rect.top - gap,
          left: rect.left + rect.width / 2,
          transform: "translate(-50%, -100%)",
        });
    }
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => {
        updatePosition();
        timeoutRef.current = setTimeout(() => {
          setVisible(true);
        }, 600);
      }}
      onMouseLeave={() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setVisible(false);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}

      {visible &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
              backgroundColor: "var(--black)",
              color: "var(--white)",
              padding: "0.5rem",
              borderRadius: "0.25rem",
              fontSize: "0.75rem",
              pointerEvents: "none",
              zIndex: 9999,
              maxWidth: "180px",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "120%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            {text}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Tooltip;
