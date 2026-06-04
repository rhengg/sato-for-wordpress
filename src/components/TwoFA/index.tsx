import React from "react";
import Modal from "../Modal";
import axios from "../../utils/axios-instance";
import Cookies from "js-cookie";
import { decodeBase64 } from "../../utils/base64";
import Loader from "../Loader";

type TwoFAProps = {
  email: string;
  enabled: boolean;
};

const Index = (props: TwoFAProps) => {
  const { email, enabled } = props;
  const [openModalDisable2fa, setOpenModalDisable2fa] =
    React.useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [pin, setPin] = React.useState<string>("");
  const [image, setImage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isTwoFaEnabled, setTwoFaEnabled] = React.useState(false);
  const [verified2FA, setVerified2FA] = React.useState(false);
  const [recoveryCode, setRecoveryCode] = React.useState("");

  const user = decodeBase64(Cookies.get("s-user") as string);

  React.useEffect(() => {
    reqQR();
  }, []);

  const reqQR = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(`/two-factors/${email}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });
      // console.log("qr", res.data);
      const dataURI = URL.createObjectURL(res.data);
      // console.log("dataURI", dataURI);

      setImage(dataURI);
      setLoading(false);
      setTwoFaEnabled(false);
    } catch (error: any) {
      setLoading(false);
      // console.log("error qr", error?.response?.status);
      setError("");
      if (error?.response?.status === 409) {
        setTwoFaEnabled(true);
      } else {
        setTwoFaEnabled(false);
      }
    }
  };

  const handleVerifyQR = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `/two-factors`,
        {
          email: email,
          passcode: pin,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        },
      );
      // console.log("verify", res);
      setVerified2FA(true);
      setRecoveryCode(res?.data?.recovery_code);
      // setTimeout(() => {
      //   Cookies.remove("s-token");
      //   Cookies.remove("splay-token");
      //   Cookies.remove("user");
      //   window.location.replace("/login");
      // }, 1500);
    } catch (error: any) {
      if (error.response.status === 401) {
        setError("invalid-passcode");
      }
      if (error.response.status === 400) {
        setError("empty-passcode");
      }
      console.log("error verify", error);
    }
  };

  const disable2FA = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setPin("");
    setLoading(true);
    if (pin === "") {
      setError("pin-empty");
      setLoading(false);
      return;
    }
    try {
      const userdata = {
        email: user?.email,
        passcode: pin,
      };
      const res = await axios.put("/two-factors", userdata, {
        headers: {
          Authorization: `Bearer ${Cookies.get("s-token")}`,
        },
      });

      setLoading(false);
      // setTimeout(() => {
      //   Cookies.remove("s-token");
      //   Cookies.remove("splay-token");
      //   Cookies.remove("user");
      //   window.location.replace("/login");
      // }, 1500);
      setOpenModalDisable2fa(false);
      await reqQR();
      // window.location.reload();
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 401) {
        setError("invalid-passcode");
      }
      if (error.response.status === 400) {
        console.log("400");
        setError("empty-passcode");
      }
      console.log("error 2FA", error);
    }
  };

  const downloadFile = () => {
    const link = document.createElement("a");
    const content = recoveryCode;
    const file = new Blob([content], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = "sato_recovery_code.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader
          height="64px"
          width="64px"
          borderColor="#f0f0f0"
          borderBottom="#000000"
        />
      </div>
    );

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <p className="subtitle-one">Two- Factor Authentication (2FA)</p>
      {/*
        <span style={{ marginLeft: '0.5rem' }}>
        {isTwoFaEnabled ?
          <img
            src="./enable2fa.svg"
            alt="no image found"
          />
          :
          <img
            src="./disable2fa.svg"
            alt="no image found"
          />
        }
      </span>
*/}
      {isTwoFaEnabled && (
        <>
          <p
            className="label textSecondary"
            style={{
              marginTop: "1rem",
              // fontFamily: 'Satoshi-Regular',
            }}
          >
            Once disabled, you will no longer require to enter the 2FA code from
            your authenticator app to log into your account.
          </p>
          {/*
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid green",
              width: "5.5rem",
              height: "2rem",
              borderRadius: "3rem",
            }}
          >
            <span className="material-symbols-outlined positive">done</span>
            <p className="body positive">Active</p>
          </div>
        */}

          {/*
          <div style={{ marginTop: '1rem', width: 'max-content' }}>
            <p className="link"
              onClick={() => {
                setOpenModalDisable2fa(true)
                setError("")
              }}
              style={{
                textDecoration: 'underline',
                cursor: 'pointer'
              }}>Disable Two factor</p>
          </div>
*/}

          <button
            className="large-danger-btn"
            onClick={() => {
              setOpenModalDisable2fa(true);
              setError("");
            }}
            style={{
              marginTop: "2rem",
            }}
          >
            Disable 2FA
          </button>

          <Modal
            isOpen={openModalDisable2fa}
            setOpen={setOpenModalDisable2fa}
            title={`Disable Two FA`}
            size="sm"
          >
            <form onSubmit={disable2FA}>
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
                  style={{ width: "100%" }}
                  value={pin}
                  onChange={(e: any) => setPin(e.target.value)}
                  name={"pin"}
                  placeholder="******"
                ></input>
              </div>

              <div className="error-container">
                {error === "invalid-passcode" && (
                  <p className="error-text">Invalid code</p>
                )}
                {error === "pin-empty" && (
                  <p className="error-text">Code cannot be empty</p>
                )}
              </div>

              <button
                type="submit"
                className="large-primary-btn"
                style={{
                  width: "100%",
                  margin: "2rem 0",
                }}
              >
                Submit
              </button>
            </form>
          </Modal>
        </>
      )}

      {!isTwoFaEnabled && (
        <>
          <p
            className="label textSecondary"
            style={{
              marginTop: "1rem",
            }}
          >
            Add another level of security for your Sato account by enabling 2FA.
          </p>
          <p
            className="label textSecondary"
            style={{
              marginTop: "1rem",
            }}
          >
            Note: When enabled, you will be required to enter the code generated
            by your Authenticator app every time you login.
          </p>
          <button
            type="button"
            className="large-primary-btn"
            style={{
              marginTop: "2rem",
            }}
            onClick={async () => {
              // await reqQR();
              setOpenModal(true);
            }}
          >
            Enable Now
          </button>
        </>
      )}

      <Modal
        isOpen={openModal}
        setOpen={setOpenModal}
        title={`Scan to enable 2FA`}
        size="sm"
      >
        <div
          style={{
            paddingLeft: "1rem",
          }}
        >
          <ul className="label textSecondary">
            <li>
              Install an authenticator app on your mobile device or computer if
              you don't have one.
            </li>
            <li
              style={{
                margin: "0.5rem 0",
              }}
            >
              Scan the QR with your chosen authenticator app.
            </li>
            <li>
              After scanning the QR, the app will display a 6-digit code that
              you can enter below.
            </li>
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1.5rem",
          }}
        >
          <img src={image} alt="qr" />
        </div>

        <form onSubmit={handleVerifyQR}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            <div style={{ marginTop: "1.5rem" }}>
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
                <p className="error-text">Invalid code!</p>
              )}
              {error === "empty-passcode" && (
                <p className="error-text">Code cannot be empty</p>
              )}
            </div>

            {recoveryCode && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: 'center',
                  marginTop: "1rem",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    borderColor: `var(--stroke)`,
                    backgroundColor: "var(--primaryVariantTwo)",
                    padding: "0.5rem",
                  }}
                >
                  <p className="body">
                    Save your recovery key securely or download it as a text
                    file now. Without it, your account cannot be recovered if
                    lost.
                  </p>
                </div>
                <p className="label">{recoveryCode}</p>
                <p
                  className="link"
                  onClick={downloadFile}
                  style={{ cursor: "pointer" }}
                >
                  Download
                </p>
              </div>
            )}

            {verified2FA ? (
              <button
                type="button"
                className="large-secondary-btn"
                style={{
                  marginTop: "2rem",
                }}
                onClick={() => {
                  setOpenModal(false);
                  reqQR();
                }}
              >
                Verification Completed
              </button>
            ) : (
              <button
                type="submit"
                className="large-primary-btn"
                style={{
                  marginTop: "2rem",
                }}
              >
                Enable
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Index;
