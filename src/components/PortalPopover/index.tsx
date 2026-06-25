import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Position = "top" | "bottom" | "left" | "right";

type PortalPopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: Position;
};

const PortalPopover: React.FC<PortalPopoverProps> = ({
  trigger,
  children,
  position = "bottom",
}) => {
  const [open, setOpen] = useState(false);

  const [actualPosition, setActualPosition] = useState<Position>(position);

  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    transform: "",
  });

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const GAP = 8;

  const getCoords = (pos: Position, triggerRect: DOMRect) => {
    switch (pos) {
      case "top":
        return {
          top: triggerRect.top - GAP,
          left: triggerRect.left + triggerRect.width / 2,
          transform: "translate(-50%, -100%)",
        };

      case "bottom":
        return {
          top: triggerRect.bottom + GAP,
          left: triggerRect.left + triggerRect.width / 2,
          transform: "translateX(-50%)",
        };

      case "left":
        return {
          top: triggerRect.top + triggerRect.height / 2,
          left: triggerRect.left - GAP,
          transform: "translate(-100%, -50%)",
        };

      case "right":
        return {
          top: triggerRect.top + triggerRect.height / 2,
          left: triggerRect.right + GAP,
          transform: "translateY(-50%)",
        };
    }
  };

  const updatePosition = (pos: Position = actualPosition) => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();

    setCoords(getCoords(pos, triggerRect));
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleViewportChange = () => {
      updatePosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, actualPosition]);

  useLayoutEffect(() => {
    if (!open) return;
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    const availableSpace = {
      top: triggerRect.top,
      bottom: window.innerHeight - triggerRect.bottom,
      left: triggerRect.left,
      right: window.innerWidth - triggerRect.right,
    };

    let fits = true;

    switch (actualPosition) {
      case "top":
        fits = availableSpace.top >= popoverRect.height + GAP;
        break;

      case "bottom":
        fits = availableSpace.bottom >= popoverRect.height + GAP;
        break;

      case "left":
        fits = availableSpace.left >= popoverRect.width + GAP;
        break;

      case "right":
        fits = availableSpace.right >= popoverRect.width + GAP;
        break;
    }

    if (!fits) {
      const bestPosition = (
        Object.entries(availableSpace) as [Position, number][]
      ).sort((a, b) => b[1] - a[1])[0][0];

      if (bestPosition !== actualPosition) {
        setActualPosition(bestPosition);
        setCoords(getCoords(bestPosition, triggerRect));
      }
    }
  }, [open, actualPosition, coords]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => {
          if (!open) {
            setActualPosition(position);
            updatePosition(position);
          }

          setOpen((prev) => !prev);
        }}
      >
        {trigger}
      </div>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
              zIndex: 9999,
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
};

export default PortalPopover;
