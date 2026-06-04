import React from "react";
import Drawer from "../Drawer";
import navigation from "../../database/navigation.json";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import dockLinks from "../../database/docLinks.json";

const DetailMenu = () => {
  const { pathname } = useLocation();
  const navigator = useNavigate();
  const [visible, setVisible] = React.useState(false);

  const handleNavigation = (link: string) => {
    navigator(link);
    setVisible(false);
  };

  return (
    <div>
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          width: "max-content",
        }}
        onClick={() => setVisible(true)}
      >
        <span className="material-symbols-outlined">notes</span>
        <div
          style={{
            width: "4rem",
            height: "4rem",
          }}
        >
          <img
            src="/sato.svg"
            alt="no image found"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      <Drawer
        width="20vw"
        isVisible={visible}
        onClose={setVisible}
        title="SplayMenu"
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {/* <div
            className={pathname === "/" ? "link-active" : "link-secondary"}
            style={{
              padding: "1rem 0",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onClick={() => handleNavigation("/")}
          >
            <p className="link-secondary">Dashboard</p>
          </div> */}
          {navigation.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  pathname === item.link ? "link-active" : "link-secondary"
                }
                style={{
                  // color: "black",
                  padding: "1rem 0",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleNavigation(item.link)}
              >
                <p className="link-secondary">{item.title}</p>
              </div>
            );
          })}
          <div
            className={"link-secondary"}
            style={{
              padding: "1rem 0",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              window.open(
                dockLinks.documentation,
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            <p className="link-secondary">Documentation</p>
          </div>
          <div
            className={"link-secondary"}
            style={{
              padding: "1rem 0",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              window.open(dockLinks.feedback, "_blank", "noopener,noreferrer");
            }}
          >
            <p className="link-secondary">Feedback</p>
          </div>
          <div
            className={"link-secondary"}
            style={{
              padding: "1rem 0",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              window.open(dockLinks.gethelp, "_blank", "noopener,noreferrer");
            }}
          >
            <p className="link-secondary">Get Help</p>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DetailMenu;
