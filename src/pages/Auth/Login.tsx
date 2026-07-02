import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import React from "react";
import { encodeBase64 } from "../../utils/base64";
import Loader from "../../components/Loader";
import { loadUserIp } from "../../utils/helper";
import DetailMenu from "../../components/DetailMenu";
import { Snackbar } from "@wordpress/components";
import { Text } from "@wordpress/ui";
import { NoticeType } from "../Home";

const Login = () => {
  const [notice, setNotice] = React.useState<NoticeType>();
  const [renderElement, setRenderElement] = React.useState("login");
  const [inputEmail, setInputEmail] = React.useState("");
  const [inputPassword, setInputPassword] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [visibility, setVisibility] = React.useState(false);
  const { nonce, apiUrl } = window.satoConfig;

  const loginWithout2FA = async () => {
    setLoading(true);
    const userdata = {
      email: inputEmail,
      password: inputPassword,
    };
    try {
      const res = await axios.post("/login", userdata);
      // Cookies.set("s-token", res.data.token, {
      //   expires: 30,
      //   secure: true,
      //   sameSite: "Strict",
      // });
      await fetch(`${apiUrl}auth-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
        body: JSON.stringify({
          token: res.data.token,
        }),
      });
      Cookies.set("s-user", encodeBase64(res.data.user), {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
      setLoading(false);
      window.location.reload();
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 404) {
        setNotice({
          status: "error",
          text: "User not found!",
        });
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error === "Invalid authentication information"
      ) {
        setNotice({
          status: "error",
          text: "Invalid Credentials!",
        });
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error === "invalid email or password"
      ) {
        setNotice({
          status: "error",
          text: "Invalid Credentials!",
        });
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "tow factor authentication token is required"
      ) {
        setRenderElement("otp-sent");
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "two-factor authentication code is required"
      ) {
        setRenderElement("otp-sent");
      }
    }
  };

  const loginWith2FA = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    if (pin === "") {
      setNotice({
        status: "error",
        text: "OTP cannot be empty!",
      });
      setLoading(false);
    }
    try {
      await internalLoging();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 403) {
        setNotice({
          status: "error",
          text: "Invalid OTP!",
        });
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "Invalid tow factor authentication token"
      ) {
        setNotice({
          status: "error",
          text: "Invalid OTP!",
        });
      }
    }
  };

  const internalLoging = async () => {
    const userdata = {
      email: inputEmail,
      password: inputPassword,
      otp: pin,
    };
    try {
      const res = await axios.post("/login", userdata);
      // Cookies.set("s-token", res.data.token, {
      //   expires: 30,
      //   secure: true,
      //   sameSite: "Strict",
      // });
      Cookies.set("s-user", encodeBase64(res.data.user), {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
      window.location.href = `${window.location.pathname}?page=sato-player`;
    } catch (error: any) {
      if (
        error.response.status === 401 &&
        error?.response?.data?.error === "Invalid authentication information"
      ) {
        setNotice({
          status: "error",
          text: "Invalid Credentials!",
        });
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error === "invalid email or password"
      ) {
        setNotice({
          status: "error",
          text: "Invalid Credentials!",
        });
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "Invalid tow factor authentication token"
      ) {
        setNotice({
          status: "error",
          text: "Invalid OTP!",
        });
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "two-factor authentication code is required"
      ) {
        setNotice({
          status: "error",
          text: "Invalid OTP!",
        });
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "invalid two-factor authentication code"
      ) {
        setNotice({
          status: "error",
          text: "Invalid OTP!",
        });
      }
    }
  };

  const handleLoginApiCall = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    if (inputEmail === "" || inputPassword === "") {
      if (inputEmail === "") {
        setNotice({
          status: "error",
          text: "Email cannot be empty!",
        });
      } else {
        setNotice({
          status: "error",
          text: "Password cannot be empty!",
        });
      }
    } else {
      await loginWithout2FA();
    }
  };

  return (
    <div className="auth-container">
      <DetailMenu />
      {notice && (
        <div
          style={{
            position: "fixed",
            top: "2%",
            left: "50%",
            zIndex: "9999",
            transform: "translate(0%,50%)",
          }}
        >
          <Snackbar
            politeness="polite"
            onDismiss={() => {
              setNotice(undefined);
            }}
            onRemove={() => {
              setNotice(undefined);
            }}
          >
            {notice.text}
          </Snackbar>
        </div>
      )}

      <div className="auth-form">
        {renderElement === "otp-sent" && (
          <form onSubmit={loginWith2FA}>
            <p className="auth-header">2FA Authentication</p>
            <div>
              <p className="input-title" style={{ marginBottom: "0.5rem" }}>
                Enter 6-digit code from your authenticator app
              </p>
              <input
                className="input-main"
                onInput={(e) => {
                  const el = e.target as HTMLInputElement;
                  if (el.value.length > 6) {
                    el.value = el.value.slice(0, 6);
                  }
                  el.value = el.value.replace(/[^0-9]/g, "");
                }}
                value={pin}
                onChange={(e: any) => setPin(e.target.value)}
                name={"pin"}
                placeholder="******"
              ></input>
            </div>

            <div style={{ minHeight: "0.5rem" }} />

            <button
              type="submit"
              className="large-primary-btn"
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
            >
              {loading ? <Loader /> : "Verify"}
            </button>
            <p
              className="body"
              style={{
                fontSize: "1rem",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              Having trouble?{" "}
              <Text
                variant="heading-lg"
                className="sato-link"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(
                    `https://app.satoplayer.com/account-recovery`,
                    "_blank",
                  );
                }}
              >
                Recover Account
              </Text>
            </p>
          </form>
        )}

        {renderElement === "login" && (
          <form onSubmit={handleLoginApiCall}>
            <p className="auth-header">Sign In</p>
            <p className="input-title">Email</p>
            <input
              className="input-main"
              style={{ width: "100%" }}
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              name="email"
              placeholder="Enter your email"
            />
            <div style={{ minHeight: "0.5rem" }} />

            <p className="input-title">Password</p>
            <div className="input-container" style={{ width: "100%" }}>
              <input
                className="input-main"
                style={{ width: "100%" }}
                autoComplete="off"
                type={!visibility ? "password" : "text"}
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                name="password"
                placeholder="********"
              />

              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: "1rem",
                  color: "black",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setVisibility(!visibility);
                }}
                className="material-symbols-outlined"
              >
                {visibility ? "visibility" : "visibility_off"}
              </span>
            </div>
            <div style={{ minHeight: "0.5rem" }} />

            <Text
              variant="heading-lg"
              className="sato-link"
              style={{
                cursor: "pointer",
                display: "inline-block",
                width: "100%",
                textAlign: "right",
              }}
              onClick={() => {
                window.open(
                  `https://app.satoplayer.com/forgot-password`,
                  "_blank",
                );
              }}
            >
              Forgot password?
            </Text>

            <div style={{ minHeight: "0.5rem" }} />

            <button
              type="submit"
              className="large-primary-btn"
              style={{
                width: "100%",
                margin: "1rem 0 0 0",
              }}
            >
              {loading ? <Loader /> : "Continue"}
            </button>

            <p
              className="body"
              style={{
                fontSize: "1rem",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              Haven't register yet?{" "}
              <Text
                variant="heading-lg"
                className="sato-link"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(`https://app.satoplayer.com/register`, "_blank");
                }}
              >
                Register Now
              </Text>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
