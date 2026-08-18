import React, { ReactNode } from "react";
import { createPortal } from "react-dom";

type ReactPortalProps = {
  children: ReactNode;
  wrapperId: string;
};

function ReactPortal({ children, wrapperId }: ReactPortalProps) {
  const [wrapperElement, setWrapperElement] = React.useState<Element | null>(
    null,
  );

  function createWrapperAndAppendToBody(wrapperId: string) {
    const wrapperElement = document.createElement("div");
    wrapperElement.setAttribute("id", wrapperId);
    wrapperElement.style.zIndex = "500";
    wrapperElement.style.width = "100vw";
    wrapperElement.style.height = "100vh";
    wrapperElement.style.background = "rgba(0, 0, 0, 0.7)";
    wrapperElement.style.position = "fixed";
    wrapperElement.style.top = "0";
    wrapperElement.style.left = "0";
    wrapperElement.style.overflow = "hidden";

    document.body.appendChild(wrapperElement);
    return wrapperElement;
  }

  React.useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element);

    return () => {
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
}
export default ReactPortal;
