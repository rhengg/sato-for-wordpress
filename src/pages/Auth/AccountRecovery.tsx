import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import axios from "../../utils/axios-instance";

const AccountRecovery = () => {
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = React.useState("");
  const [inputPassword, setInputPassword] = React.useState("");
  const [inputRecovery, setInputRecovery] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [visibility, setVisibility] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const recovery = async () => {
    const userdata = {
      email: inputEmail,
      password: inputPassword,
      recovery_code: inputRecovery,
    };
    try {
      const res = await axios.post("/recovery", userdata);
      // console.log('success recovery', res);
      setSuccess(true);
      setTimeout(() => {
        navigate({ pathname: "/signin" });
      }, 1000);
    } catch (error) {
      setSuccess(false);
      console.log("login error", error);
      setError("recovery-error");
    }
  };

  const handleAccountRecovery = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (inputEmail === "" || inputPassword === "" || inputRecovery === "") {
      if (inputEmail === "") {
        setError("empty-email");
      } else if (inputPassword === "") {
        setError("empty-password");
      } else {
        setError("empty-recovery");
      }
    } else {
      await recovery();
    }
  };

  return (
    <div className="auth-form">
      <p className="auth-header">Account Recovery</p>
      <form onSubmit={handleAccountRecovery}>
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
          {error === "empty-email" && (
            <p className="error-text required-error-text-space">
              Required field!
            </p>
          )}
        </div>

        <p className="input-title">Password</p>
        <div className="input-container">
          <input
            className="input-main"
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
              top: "24%",
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

        <div
          style={{
            marginTop: "1.5rem",
          }}
        >
          <p className="input-title">Recovery Code</p>
        </div>
        <input
          className="input-main"
          type="text"
          value={inputRecovery}
          onChange={(e) => setInputRecovery(e.target.value)}
          name="recovery"
          placeholder="Enter your recovery code"
        />
        <div style={{ minHeight: "1rem" }}>
          {error === "empty-recovery" && (
            <p className="error-text required-error-text-space">
              Required field!
            </p>
          )}
        </div>

        <div className="error-container">
          {error === "invalid-credentials" && (
            <p className="error-text">Invalid Credentials!</p>
          )}
          {error === "recovery-error" && (
            <p className="error-text">Wrong recovery key or email</p>
          )}
        </div>

        {success && (
          <p className="register-success-heading" style={{ margin: 0 }}>
            Account Recovered Successfully
          </p>
        )}

        <button
          type="submit"
          className="large-primary-btn"
          style={{
            width: "100%",
            // margin: "2rem 0",
          }}
        >
          {loading ? <Loader /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AccountRecovery;
