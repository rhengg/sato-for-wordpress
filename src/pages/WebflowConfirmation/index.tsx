import React from "react";
import axios from "../../utils/axios-instance";
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navigation from "../../components/Navigation";

const WebflowConfirmation = () => {
  const accessToken = Cookies.get("s-token");

  const params = new URLSearchParams(window.location.search);
  const wfCode = params.get("code");
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [agree, setAgree] = React.useState(false);

  const handleRedirect = (url: string) => {
    window.location.href = url;
  };

  const verifyWebflowCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `/webflow/callback?code=${wfCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("s-token")}`,
          },
        },
      );
      sessionStorage.removeItem("webflow-code");
      handleRedirect(res.data?.redirect_url);
    } catch (error: any) {
      console.log("error verify webflow code", error);
      setError("invalid");
      setErrorMessage(
        error?.response?.data?.error ||
          "An error occurred while verifying the code.",
      );
      setLoading(false);
      sessionStorage.removeItem("webflow-code");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!accessToken) {
      navigate({ pathname: "/signin", search: `?code=${wfCode}` });
    }
  }, []);

  return (
    <>
      <style>
        {`
          .access-container {
            border-radius: 0.5rem;
            padding: 2rem;
            border: 1px solid var(--stroke);
            width: 90%;
            max-width: 520px;
          }
          
        `}
      </style>

      <Navigation />
      <div className="main-page-wrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <img
            src="/satoWebflow.svg"
            alt="satoWebflow Illustration"
            style={{
              width: "10rem",
              display: "block",
            }}
          />
          <p className="subtitle-two">Connecting Webflow to Sato</p>
        </div>
        <div
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="access-container">
            <p className="body">
              This app is requesting access to your Sato Player account.
              Continue connecting if you agree.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                position: "relative",
                gap: "0.5rem",
                marginTop: "2rem",
              }}
            >
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{
                  accentColor: "var(--primary)",
                  marginTop: "0.25rem",
                }}
              />
              <p className="body">
                You are agreeing to use a third party application by installing
                this integration. Please confirm you understand that the app's
                own{" "}
                <span className="primary">
                  <Link
                    to={"https://webflow.com/legal/terms"}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                    className="primary"
                    rel="noopener noreferrer"
                  >
                    terms
                  </Link>
                </span>{" "}
                and{" "}
                <span className="primary">
                  <Link
                    to={"https://webflow.com/legal/privacy"}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                    className="primary"
                    rel="noopener noreferrer"
                  >
                    privacy policy
                  </Link>
                </span>{" "}
                apply to its use and that you've reviewed and agree to those
                terms and privacy policy.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button
                className="large-primary-btn"
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                disabled={!agree}
                onClick={() => {
                  verifyWebflowCode();
                }}
              >
                {loading ? <Loader /> : "Connect"}
              </button>

              <button
                className="large-secondary-btn"
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onClick={() => {
                  sessionStorage.removeItem("webflow-code");
                  navigate({ pathname: "/" });
                }}
              >
                Cancel
              </button>
            </div>
            {errorMessage && (
              <div className="error-container">
                <p className="error-text">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WebflowConfirmation;
