import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    };

    const node = wrapperRef.current;
    if (node) {
      node.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (node) {
        node.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
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
              top: coords.y - 4,
              left: coords.x,
              transform: "translate(-3%, -100%)",
              backgroundColor: "var(--surface)",
              color: "var(-textSecondary)",
              border: "1px solid var(--strokeSecondary)",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.25rem",
              fontSize: "0.75rem",
              pointerEvents: "none",
              zIndex: 9999,
              maxWidth: "180px",
              whiteSpace: "normal",
              wordWrap: "break-word",
              wordBreak: "break-word",
              lineHeight: "120%",
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
