import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./toast.css";

type ToastProps = {
  show: boolean;
  hideToast: any;
  children: React.ReactElement;
};

const Toast = (props: ToastProps) => {
  const { show, hideToast, children } = props;
  const [node] = useState(document.createElement("div"));

  const removeNode = () => {
    // @ts-ignore
    if (document.querySelector("#toast")?.children?.length) {
      // @ts-ignore
      document.querySelector("#toast")?.childNodes[0]?.remove();
    }
  };

  useEffect(() => {
    if (show) {
      // @ts-ignore
      document
        .querySelector("#toast")
        ?.appendChild(node)
        ?.classList?.add("toast");

      setTimeout(() => {
        removeNode();
        hideToast();
      }, 5000);
    } else {
      removeNode();
    }

    return () => removeNode();
  }, [node, show]);

  return ReactDOM.createPortal(children, node);
};

export default Toast;
