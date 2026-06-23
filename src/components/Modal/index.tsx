import React, { Dispatch, SetStateAction } from "react";
import ReactPortal from "../ReactPortal";
import IconButton from "../IconButton";
import "./modal.css";

type ModalProps = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>> | any;
  title?: string;
  children: React.ReactNode;
  handleClickEvent?: Function;
  size?: "sm" | "md" | "lg";
  closeButton?: boolean;
  modalWidth?: string;
};

const Modal = (props: ModalProps) => {
  const {
    isOpen,
    setOpen,
    title,
    children,
    size,
    closeButton = true,
    modalWidth = "50vw",
  } = props;

  const [width, setWidth] = React.useState("60vw");

  React.useEffect(() => {
    if (size === "sm") {
      setWidth("480px");
    } else if (size === "md") {
      setWidth("900px");
    } else if (size === "lg") {
      setWidth("1200px");
    } else {
      setWidth("480px");
    }
  }, [size]);

  React.useEffect(() => {
    const closeOnEscapeKey = (e: any) =>
      e.key === "Escape" ? setOpen(false) : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [setOpen]);

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="centered">
        <div
          className="modal"
          style={{
            width: modalWidth,
            maxWidth: width,
            minWidth: "410px",
            maxHeight: "90vh",
          }}
        >
          <div
            className="modalHeader"
            style={{ justifyContent: closeButton ? "space-between" : "center" }}
          >
            <p className="subtitle-one">{title}</p>

            {closeButton && (
              <IconButton onClick={() => setOpen(false)}>
                <span className="material-symbols-outlined white">close</span>
              </IconButton>
            )}
          </div>

          <div className="modalContent">{children}</div>
        </div>
      </div>
    </ReactPortal>
  );
};
export default Modal;
