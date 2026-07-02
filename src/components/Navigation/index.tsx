import React from "react";
import Cookies from "js-cookie";
import "./navigation.css";
import { useLocation, useNavigate } from "react-router-dom";
import Drawer from "../Drawer";
import navigation from "../../database/navigation.json";
import { decodeBase64 } from "../../utils/base64";
import { Link } from "react-router-dom";
import Popover from "../Popover";
import docLinks from "../../database/docLinks.json";
import axios from "../../utils/axios-instance";
import satoSvg from "../../assets/sato.svg";

/**
 * Navigation component is used in home layout
 * This component renders brand title, user name and signout button
 */

const Navigation = () => {
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const [visible, setVisible] = React.useState(false);

  // removes the cookie and redirects to login page
  const handleSignOut = async () => {
    try {
      const res = await axios.get("/logout", {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("logout", res.data);
      Cookies.remove("splay-token");
      Cookies.remove("s_subs");
      Cookies.remove("s-pay");
      sessionStorage.removeItem("choosen-plan");
      window.location.replace("/signin");
    } catch (e) {
      console.log("error login", e);
      Cookies.remove("splay-token");
      Cookies.remove("s_subs");
      Cookies.remove("s-pay");
      window.location.replace("/signin");
      sessionStorage.removeItem("choosen-plan");
    }
  };

  const handleNavigation = (link: string) => {
    navigator(link);
    setVisible(false);
  };

  return (
    <div className="nav-main">
      <div className="nav-container">
        <div
          className="nav-left-mobile"
          onClick={() => setVisible(true)}
          style={{ cursor: "pointer" }}
        >
          <span className="material-symbols-outlined">notes</span>
          <div
            style={{
              width: "4rem",
              height: "4rem",
            }}
          >
            <img
              src={satoSvg}
              alt="no image found"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          {/* <p className="subtitle-two">Splay</p> */}
        </div>

        <Drawer
          width="20vw"
          isVisible={visible}
          onClose={setVisible}
          title="Sato"
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div
              className={pathname === "/" ? "link-active" : "link-secondary"}
              style={{
                padding: "1rem 0",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => handleNavigation("/")}
            >
              <p className="body">Dashboard</p>
            </div>
            {navigation
              .filter((item) => item.link !== "/")
              .map((item, index) => {
                const isActive = pathname.startsWith(item.link);

                return (
                  <div
                    key={index}
                    className={isActive ? "link-active" : "link-secondary"}
                    style={{
                      padding: "1rem 0",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleNavigation(item.link)}
                  >
                    <p className="body">{item.title}</p>
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
                  docLinks.documentation,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            >
              <p className="body">Documentation</p>
            </div>
            <div
              className={"link-secondary"}
              style={{
                padding: "1rem 0",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(docLinks.feedback, "_blank", "noopener,noreferrer");
              }}
            >
              <p className="body">Feedback</p>
            </div>
            <div
              className={"link-secondary"}
              style={{
                padding: "1rem 0",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(docLinks?.terms, "_blank", "noopener,noreferrer");
              }}
            >
              <p className="body"> Terms of Service</p>
            </div>

            <div
              className={"link-secondary"}
              style={{
                padding: "1rem 0",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(docLinks?.privacy, "_blank", "noopener,noreferrer");
              }}
            >
              <p className="body"> Privacy Policy</p>
            </div>

            <div
              className={"link-secondary"}
              style={{
                padding: "1rem 0",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(docLinks?.dpa, "_blank", "noopener,noreferrer");
              }}
            >
              <p className="body"> DPA</p>
            </div>

            <div
              className={"link-secondary"}
              style={{
                padding: "1rem 0",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(docLinks.gethelp, "_blank", "noopener,noreferrer");
              }}
            >
              <p className="body">Get Help</p>
            </div>
            {/*
            <div
              className="navigation-btn-mobile"
              style={{
                border: "1px solid black",
                padding: "0 0.5rem",
                width: "50%",
                marginTop: '1rem'
              }}
              onClick={() => handleSignOut()}
            >
              <p className="body">Sign Out</p>
            </div>
            */}
            <button
              className="large-secondary-btn"
              style={{
                marginTop: "1rem",
                minWidth: "8rem",
                width: "50%",
              }}
              onClick={() => handleSignOut()}
            >
              Logout
            </button>
          </div>
        </Drawer>

        <div
          className="nav-left"
          style={{
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "4rem",
              height: "4rem",
            }}
            onClick={() => navigator("/")}
          >
            <img
              src={satoSvg}
              alt="no image found"
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {pathname != "/detail" && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              {navigation.slice(0, 2).map((item, index) => {
                const isActive =
                  pathname === item.link ||
                  pathname.startsWith(item.link + "/");
                return (
                  <Link
                    key={index}
                    className={isActive ? "link-active" : "link-secondary"}
                    style={{
                      // color: "black",
                      padding: "0.5rem 1rem",
                      textDecoration: "none",
                    }}
                    to={{ pathname: item.link }}
                  >
                    {item.title}
                  </Link>
                );
              })}
              <div
                style={{
                  position: "relative",
                }}
              >
                <Popover
                  trigger={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.35rem 0 0.5rem 1rem",
                      }}
                    >
                      <p className="sato-link-secondary">Settings</p>
                      <span className="material-symbols-outlined nav-icon">
                        keyboard_arrow_up
                      </span>
                    </div>
                  }
                  content={<Content logout={handleSignOut} />}
                />
              </div>
            </div>
          )}
        </div>

        {/* <div className="nav-right">
					<div className="hide">
						<p className="subtitle-two">{user.name}</p>
					</div>
					<div>
						<button className="large-secondary-btn" onClick={handleSignOut}> Sign Out </button>
					</div>
				</div> */}
      </div>
    </div>
  );
};

const Content = (props: any) => {
  const { logout } = props;
  const navigate = useNavigate();

  const handleClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <p
        className="body"
        onClick={() => {
          navigate("/profile");
        }}
      >
        Profile
      </p>
      <p className="body" onClick={() => handleClick(docLinks.documentation)}>
        Documentation
      </p>
      <p className="body" onClick={() => handleClick(docLinks.feedback)}>
        Feedback
      </p>
      <p className="body" onClick={() => handleClick(docLinks.gethelp)}>
        Get Help
      </p>
      <p className="body" onClick={logout}>
        Logout
      </p>
    </>
  );
};
export default Navigation;
