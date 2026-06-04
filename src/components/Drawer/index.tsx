import React, { Dispatch, SetStateAction, useEffect } from "react";
import "./drawer.css";
import ReactPortal from "../ReactPortal";
import IconButton from "../IconButton";
import { Link, useNavigate } from "react-router-dom";
import packagejson from "../../../package.json";

type DrawerProps = {
  isVisible: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  title?: string;
  children: React.ReactNode;
  width?: string;
};

const Drawer = (props: DrawerProps) => {
  const { isVisible, onClose, title, children, width } = props;
  const navigator = useNavigate();

  if (!isVisible) return null;

  return (
    <ReactPortal wrapperId="react-portal-drawer">
      <div
        className="drawer"
        style={{
          position: "relative",
        }}
      >
        <div className="drawerHeader">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "4rem",
                height: "4rem",
                cursor: "pointer",
              }}
              onClick={() => {
                navigator("/");
                onClose(false);
              }}
            >
              <img
                src="/sato.svg"
                alt="no image found"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            {/* <p className='heading black'>{title}</p> */}
          </div>

          <IconButton onClick={() => onClose(false)}>
            <span className="material-symbols-outlined white">close</span>
          </IconButton>
        </div>

        <div className="drawerContent">{children}</div>

        <div
          className="get-help-container"
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "2rem",
          }}
        >
          {/*
          <Link
            to={'https://www.skara.app/splay-support'}
            target='_blank'
            className='large-gethelp-btn'
          >
            <p className='body' style={{ fontSize: '1rem', color: '#FFFFFF' }}>Get Help ?</p>
          </Link>
        */}

          {/* <p className="label" style={{ marginTop: "0.5rem" }}>
            Version {packagejson.version}
          </p> */}
        </div>
      </div>
    </ReactPortal>
  );
};

export default Drawer;
