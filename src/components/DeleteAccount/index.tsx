import React from "react";
import Modal from "../Modal";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import Loader from "../Loader";
import { decodeBase64 } from "../../utils/base64";
import "./deleteAccount.css";

type DeleteAccountProps = {
  email: string;
};

const Index = (props: DeleteAccountProps) => {
  const { email } = props;
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [pin, setPin] = React.useState<string>("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [deleted, setDeleted] = React.useState(false);

  const generateOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/otps/generate", {
        email,
      });
      setLoading(false);
    } catch (error: any) {
      console.log("error generate otp", error);
      setLoading(false);
      setError("otp-error");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (openModal) {
      generateOtp();
    }
  }, [openModal]);

  const handleDeleteAccount = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `/delete-account`,
        {
          otp: pin,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        },
      );
      // console.log("verify");
      setDeleted(true);
      Cookies.remove("splay-token");
      Cookies.remove("s_subs");
      sessionStorage.removeItem("choosen-plan");
      Cookies.remove("s-pay");
      setTimeout(() => {
        window.location.replace("/");
      }, 800);
    } catch (error: any) {
      if (error.response.status === 403) {
        setError("invalid-passcode");
      }
      console.log("error deleting account", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="delete-account-container">
      <p className="subtitle-one">Delete My Account</p>

      <p
        className="label textSecondary"
        style={{
          marginTop: "1rem",
          // fontFamily: 'Satoshi-Regular',
        }}
      >
        Deleting your account is a permanent action and cannot be undone. All
        your data, settings, and saved content will be permanently erased. To
        proceed, an OTP will be generated and sent to your registered email for
        verification.
      </p>
      <p
        className="label textSecondary"
        style={{
          marginTop: "1rem",
          // fontFamily: 'Satoshi-Regular',
        }}
      >
        Are you sure you want to proceed?
      </p>
      <button
        type="button"
        className="large-danger-btn"
        style={{
          marginTop: "2rem",
        }}
        onClick={() => {
          setOpenModal(true);
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              columnGap: "0.25rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontWeight: "bold" }}
            >
              delete_forever
            </span>
            Delete
          </div>
        )}
      </button>

      <Modal
        isOpen={openModal}
        setOpen={setOpenModal}
        title={`Delete Acccount`}
        size="sm"
      >
        <p
          className="body textSecondary"
          style={{
            marginTop: "1rem",
            fontFamily: "Satoshi-Regular",
          }}
        >
          An OTP has been sent to your registered email. To confirm deletion,
          please enter your OTP.
        </p>
        <p
          className="body textSecondary"
          style={{
            marginTop: "1rem",
            fontFamily: "Satoshi-Regular",
          }}
        >
          This action is permanent and cannot be undone.
        </p>
        <form onSubmit={handleDeleteAccount}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            <div style={{ marginTop: "2rem" }}>
              <p className="input-title">To confirm this, type "DELETE"</p>
              <input
                className="input-main"
                style={{ width: "100%" }}
                autoComplete="off"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                name="text"
                // placeholder="Enter your user name"
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <p className="input-title">Enter the OTP sent to {email}</p>
              <input
                className="input-main"
                onInput={(e) => {
                  const el = e.target as HTMLInputElement;
                  if (el.value.length > 6) {
                    el.value = el.value.slice(0, 6);
                  }
                  el.value = el.value.replace(/[^0-9]/g, "");
                }}
                style={{ width: "100%" }}
                autoComplete="off"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                name="password"
                placeholder="********"
              />
            </div>

            <div className="error-container">
              {error === "invalid-passcode" && (
                <p className="error-text">Invalid Code!</p>
              )}
              {error === "otp-error" && (
                <p className="error-text">Unable send otp</p>
              )}
            </div>

            {deleted && <p className="body positive">Account deleted</p>}

            <button
              type="submit"
              className="large-danger-btn"
              disabled={text.toUpperCase() != "DELETE"}
              style={{
                marginTop: "2rem",
                width: "100%",
              }}
            >
              Delete
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Index;
