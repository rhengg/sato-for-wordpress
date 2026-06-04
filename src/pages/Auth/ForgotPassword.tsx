import Cookies from "js-cookie";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios-instance";
import Loader from "../../components/Loader";
import { validatePassword } from "../../utils/helper";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confPassword, setConfPassword] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [pin, setPin] = React.useState("");
  const [pinId, setPinId] = React.useState("");
  const [renderElement, setRenderElement] = React.useState("email");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [visibilityPass, setVisibilityPass] = React.useState(false);
  const [visibilityConfPass, setVisibilityConfPass] = React.useState(false);

  const generateOTP = async (email: string) => {
    setOtpSent(false);
    setError("");
    setLoading(true);
    setToggleOtpTimer(true)
    try {
      const res = await axios.post("/otps/generate", {
        email,
        // purpose: "password_reset",
      });
      setOtpSent(true);
      setRenderElement("password-field");
      setPinId(res.data.id);
      // console.log('success', res);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setOtpSent(false);
      if (error?.response?.status === 404) {
        setError("no-user-found-fp");
      }
      console.log("error generating otp", error);
    }
  };

  // const verifyOTP = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);
  //   const otpdata = { id: pinId, code: pin };
  //   try {
  //     const res = await axios.post("/otps/verify", otpdata);
  //     // console.log('otp verification', res);
  //     Cookies.set("splay-token", res.data.token, { expires: 7, path: "/" });
  //     setRenderElement("password-field");
  //     setLoading(false);
  //   } catch (error: any) {
  //     setLoading(false);
  //     if (error?.response?.status === 401) {
  //       setError("invalid-otp");
  //       console.log("invalid-otp");
  //     }
  //     console.log("error verifying otp", error);
  //     setError("");
  //   }
  // };

  const resetPassowrd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    if (password === "") {
      setError('empty-password')
      return
    }
    if (confPassword === "") {
      setError('empty-confpassword')
      return
    }
    if (!validatePassword(password as string)) {
      setError("invalid-password");
      return;
    }
    if (password != confPassword) {
      setError('password-mismatch')
      return
    }
    setLoading(true);
    const userdata = {
      email: inputEmail,
      password: password,
      // conf_password: confPassword,
      otp: pin
    };
    try {
      const res = await axios.post("/reset-password", userdata, {
        headers: {
          Authorization: `Bearer ${Cookies.get("splay-token")}`,
        },
      });
      // console.log('success', res);
      setRenderElement("reset-success");
      setOtpSent(false);
      setLoading(false);
      setTimeout(() => {
        navigate({ pathname: "/signin" });
      }, 800);
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 401) {
        setError("invalid");
      } else if (error.response.status === 403) {
        setError("unregistered");
      }
      console.log("error reset password", error);
    }
  };

  const handleRecoveryApiCall = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setError("");
    if (inputEmail === "") {
      setError("email");
      setLoading(false);
    } else {
      await generateOTP(inputEmail as string);
      // setError('')
      // console.log("reset password");
    }
  };

  const handleSignInClick = () => {
    navigate({
      pathname: "/signin",
    });
  };

  const timerValue = 59;
  const [toggleOtpTimer, setToggleOtpTimer] = React.useState(true);
  const [minutes, setMinutes] = React.useState<string>();
  const [seconds, setSeconds] = React.useState<string>();
  const [timer, setTimer] = React.useState(timerValue);

  React.useEffect(() => {
    const minuteFromTimer = Math.floor(timer / 60).toLocaleString();
    setMinutes(minuteFromTimer);
    const secondFromTimer = (timer % 60).toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    });
    setSeconds(secondFromTimer);

    setTimeout(() => {
      if (timer !== 0) {
        setTimer(timer - 1);
      } else {
        setToggleOtpTimer(false);
      }
    }, 1500);
  }, [timer]);

  const resendOtp = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const res = await axios.post("/otps/generate", {
      email: inputEmail,
    });
    handleTimerReset();
  };
  const handleTimerReset = () => {
    setTimer(timerValue);
    setToggleOtpTimer(true);
  };

  return (
    <div className="auth-form">

      {/* otp-section */}
      {/*
      {renderElement === "otp-sent" && (
        <form onSubmit={()=>setRenderElement('password-field')}>
          <p className="auth-header">Verify OTP</p>
          <div>
            <p className="input-title">Enter the OTP on your {inputEmail}</p>
            <input
              className="input-main"
              type={"password"}
              value={pin}
              onChange={(e: any) => setPin(e.target.value)}
              name={"pin"}
              placeholder="******"
            />
          </div>

          <div className="error-container">
            {error === "invalid-otp" && (
              <p className="error-text">Invalid OTP</p>
            )}
            {error === "exists" && (
              <p className="error-text">Email already exists</p>
            )}
          </div>

          <button
            type="submit"
            className="large-primary-btn"
            style={{
              width: "100%",
              margin: "1.5rem 0",
            }}
          >
            {loading ? <Loader /> : "Confirm"}
          </button>
        </form>
      )}
      */}

      {/* password-section */}
      {renderElement === "password-field" && (
        <form onSubmit={resetPassowrd}>
          <p className="auth-header">Create New Password</p>
          <p className="input-title">New Password</p>
          <div className="input-container">
            <input
              // autoComplete='off'
              className="input-main"
              type={!visibilityPass ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="******"
            />
            <span
              style={{
                position: "absolute",
                top: "24%",
                right: "1rem",
                color: "black",
                cursor: "pointer",
              }}
              onClick={() => {
                setVisibilityPass(!visibilityPass);
              }}
              className="material-symbols-outlined"
            >
              {visibilityPass ? "visibility" : "visibility_off"}
            </span>
          </div>
          <div className="error-container">
            {error === "empty-password" && (
              <p className="error-text required-error-text-space">
                Required field!
              </p>
            )}
          </div>

          <p className="input-title">Confirm New Password</p>
          <div className="input-container">
            <input
              className="input-main"
              type={!visibilityConfPass ? "password" : "text"}
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              name="confPassword"
              placeholder="******"
            />
            <span
              style={{
                position: "absolute",
                top: "24%",
                right: "1rem",
                color: "black",
                cursor: "pointer",
              }}
              onClick={() => {
                setVisibilityConfPass(!visibilityConfPass);
              }}
              className="material-symbols-outlined"
            >
              {visibilityConfPass ? "visibility" : "visibility_off"}
            </span>
          </div>
          <div className="error-container"
            style={{ maxWidth: '17rem' }}>
            {error === "empty-confpassword" && (
              <p className="error-text required-error-text-space">
                Required field!
              </p>
            )}
            {error === "password-mismatch" && (
              <p className="error-text">Password mismatch</p>
            )}
            {error === "invalid-password" && (
              <p className="error-text">
                Password must be at least 8 characters with uppercase, number & special character.
              </p>
            )}
          </div>


          <div style={{ marginTop: '2rem' }}>
            <p className="input-title">Enter the OTP sent on {inputEmail}</p>
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
            />
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            {toggleOtpTimer === false && (
              <div>
                <p className="label"
                  style={{
                    color: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                  onClick={resendOtp}>
                  Resend Code
                </p>
              </div>
            )}
            {toggleOtpTimer === true && (
              <div>
                <p className="label">
                  Resend Code in {minutes}:{seconds}
                </p>
              </div>
            )}
          </div>


          <div className="error-container">
            {error === "unregistered" && (
              <p className="error-text">Unregistered email!</p>
            )}

            {error === "invalid" && (
              <p className="error-text">OTP verification failed!</p>
            )}
          </div>

          <button
            type="submit"
            className="large-primary-btn"
            style={{
              width: "100%",
              margin: "1rem 0",
            }}
          >
            {loading ? <Loader /> : "Submit"}
          </button>
        </form>
      )}

      {/* reset-success */}
      {renderElement === "reset-success" && (
        <>
          <p className="register-success-heading">
            Password reset successfully
          </p>
          <button
            className="large-primary-btn"
            style={{
              width: "100%",
            }}
            onClick={handleSignInClick}
          >
            Sign In
          </button>
        </>
      )}

      {/* enter-email-section */}
      {renderElement === "email" && (
        <form onSubmit={handleRecoveryApiCall}>
          <p className="auth-header">Password Recovery</p>
          <p className="input-title">Email</p>
          <input
            className="input-main"
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            name="email"
            placeholder="Enter your email"
          />
          <div style={{ minHeight: "1rem" }}>
            {error === "email" && (
              <p className="error-text required-error-text-space">
                Required field!
              </p>
            )}
          </div>

          <div className="error-container">
            {error === "no-user-found-fp" && (
              <p className="error-text">We found no user with this email.</p>
            )}
          </div>

          <button
            type="submit"
            className="large-primary-btn"
            style={{
              width: "100%",
              // margin: "2rem 0",
            }}
          >
            {loading ? <Loader /> : "Continue"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
