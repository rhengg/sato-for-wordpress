import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { encodeBase64 } from "../../utils/base64";
import Loader from "../../components/Loader";
import { loadUserIp } from "../../utils/helper";

/**
 * Returns the login page.
 * Renders two input fields(i.e email and password)
 * Renders two buttons(i.e signin and register)
 */
const Login = () => {
  const params = new URLSearchParams(window.location.search);
  const wfCode = params.get("code");
  const choosenPlan = params.get("planId");
  const choosenPlanAmount = params.get("planAmount");

  React.useEffect(() => {
    if (wfCode) {
      sessionStorage.setItem(
        "webflow-code",
        JSON.stringify({
          code: wfCode,
        }),
      );
    }
  }, [wfCode]);

  React.useEffect(() => {
    if (choosenPlan) {
      sessionStorage.setItem(
        "choosen-plan",
        JSON.stringify({
          planId: choosenPlan,
          amount: choosenPlanAmount,
        }),
      );
    }
  }, [choosenPlan]);

  const navigate = useNavigate();

  const [renderElement, setRenderElement] = React.useState("login");
  const [inputEmail, setInputEmail] = React.useState("");
  const [inputPassword, setInputPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [visibility, setVisibility] = React.useState(false);
  const { nonce, apiUrl } = window.satoConfig;

  const loginWithout2FA = async () => {
    setError("");
    setLoading(true);
    const userdata = {
      email: inputEmail,
      password: inputPassword,
    };
    try {
      // const countryCode = await loadUserIp();
      const res = await axios.post("/login", userdata);
      // console.log("success login", res.data);
      Cookies.set("s-token", res.data.token, {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("s-user", encodeBase64(res.data.user), {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
      setLoading(false);

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

      // if (choosenPlan) {
      //   window.location.replace(
      //     `/checkout/${countryCode === "IN" ? "IN" : countryCode}?planId=${choosenPlan}&planAmount=${choosenPlanAmount}`,
      //   );
      // } else {
      //   window.location.replace("/");
      // }
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 404) {
        setError("user-not-found");
      }
      console.log("msss", error?.response?.data?.error);
      if (
        error.response.status === 401 &&
        error?.response?.data?.error === "Invalid authentication information"
      ) {
        setError("invalid-credentials");
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error === "invalid email or password"
      ) {
        setError("invalid-credentials");
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
      console.log("error login", error);
    }
  };

  const loginWith2FA = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (pin === "") {
      setError("pin-empty");
      setLoading(false);
    }
    try {
      await internalLoging();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 403) {
        setError("invalid-passcode");
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "Invalid tow factor authentication token"
      ) {
        setError("invalid-passcode");
      }
      console.log("error 2FA", error);
    }
  };

  const internalLoging = async () => {
    const userdata = {
      email: inputEmail,
      password: inputPassword,
      otp: pin,
    };
    try {
      const countryCode = await loadUserIp();
      const res = await axios.post("/login", userdata);
      // console.log('internal login success', res);
      Cookies.set("s-token", res.data.token, {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("s-user", encodeBase64(res.data.user), {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
      if (choosenPlan) {
        window.location.replace(
          `/checkout/${countryCode === "IN" ? "IN" : countryCode}?planId=${choosenPlan}&planAmount=${choosenPlanAmount}`,
        );
      } else {
        window.location.replace("/");
      }
    } catch (error: any) {
      console.log("login error", error);
      if (
        error.response.status === 401 &&
        error?.response?.data?.error === "Invalid authentication information"
      ) {
        setError("invalid-credentials");
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error === "invalid email or password"
      ) {
        setError("invalid-credentials");
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "Invalid tow factor authentication token"
      ) {
        setError("invalid-passcode");
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "two-factor authentication code is required"
      ) {
        setError("invalid-passcode");
      }
      if (
        error.response.status === 401 &&
        error?.response?.data?.error ===
          "invalid two-factor authentication code"
      ) {
        setError("invalid-passcode");
      }
    }
  };

  /**
   * Validates the user input.
   * Compares input values with localStorage values.
   * After validation, sets a cookie and then redirects to list view page.
   * If Validation fails, sets respective useState hooks with its respective error.
   */
  const handleLoginApiCall = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    if (inputEmail === "" || inputPassword === "") {
      if (inputEmail === "") {
        setError("empty-email");
      } else {
        setError("empty-password");
      }
    } else {
      await loginWithout2FA();
      // window.location.replace("/")
    }
  };

  // this function redirects a user to register page
  const handleAccountCreateClick = () => {
    navigate({
      pathname: "/register",
    });
  };

  const handleAccountRecoveryClick = () => {
    navigate({
      pathname: "/account-recovery",
    });
  };
  return (
    <div className="auth-form">
      {renderElement === "otp-sent" && (
        <form onSubmit={loginWith2FA}>
          <p className="auth-header">2FA Authentication</p>
          <div>
            <p className="input-title">
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

          <div className="error-container">
            {error === "invalid-passcode" && (
              <p className="error-text">Invalid OTP</p>
            )}
            {error === "pin-empty" && (
              <p className="error-text">Pin cannot be empty</p>
            )}
          </div>

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
            <span
              className="primary"
              style={{ cursor: "pointer" }}
              onClick={handleAccountRecoveryClick}
            >
              <Link
                to={"/account-recovery"}
                style={{ textDecoration: "none" }}
                className="primary"
              >
                Recover Account
              </Link>
            </span>
          </p>
        </form>
      )}

      {/* login-form */}
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
          <div style={{ minHeight: "1rem" }}>
            {error === "empty-email" && (
              <p className="error-text required-error-text-space">
                Required field!
              </p>
            )}
          </div>

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
          <div className="error-container">
            {error === "empty-password" && (
              <p className="error-text required-error-text-space">
                Required field!
              </p>
            )}
          </div>
          <div>
            <Link
              to={"/forgot-password"}
              style={{
                textAlign: "right",
                // color: "#45474b",
                textDecoration: "none",
              }}
            >
              <p className="link">Forgot password ?</p>
            </Link>
          </div>

          <div className="error-container">
            {error === "user-not-found" && (
              <p className="error-text">User not found!</p>
            )}
            {error === "invalid-credentials" && (
              <p className="error-text">Invalid Credentials!</p>
            )}
          </div>

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
            <span
              className="primary"
              // style={{ cursor: 'pointer' }}
              // onClick={handleAccountCreateClick}
            >
              <Link
                to={
                  choosenPlan
                    ? `/register?planId=${choosenPlan}&planAmount=${choosenPlanAmount}`
                    : "/register"
                }
                style={{ textDecoration: "none" }}
                className="primary"
              >
                Register Now
              </Link>
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
