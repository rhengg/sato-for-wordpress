import React from "react";
import { Outlet } from "react-router-dom";
import Loader from "../../components/Loader";
import LazyImage from "../../components/LazyImage";
import AuthLogo from "../../assets/auth_logo.svg";

/**
 * This layout returns two spaces divided vertically.
 * South Asian Musicians along with a default profile photo is rendered in left space.
 * Dynamic pages (i.e signin and signup page) will be rendered in right space.
 */
const AuthLayout = ({ children }: any) => {
  return (
    <div className="auth-layout-main">
      <div className="auth-layout-container">
        <div className="auth-layout-content-logo">
          <React.Suspense
            fallback={
              <Loader
                height="24px"
                width="24px"
                borderColor="#f0f0f0"
                borderBottom="#000000"
              />
            }
          >
            <LazyImage src={AuthLogo} alt="auth image" />
          </React.Suspense>
        </div>
      </div>
      <div className="auth-layout-children-container">
        {children}
        {/* <Outlet /> */}
      </div>
    </div>
  );
};

export default AuthLayout;
