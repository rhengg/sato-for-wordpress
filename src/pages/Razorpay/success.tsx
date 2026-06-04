import React from "react";
import { decodeBase64 } from "../../utils/base64";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../assets/success_lottie.json";

const Success = () => {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");

  return (
    // <Error errorMessage={decodeBase64(msg as string) || 'Internal Server Error'} />
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // gap: "2.5rem",
        }}
      >
        {/* Illustration */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ maxWidth: 420 }}
          />
        </div>

        {/* Text Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            alignItems: "center",
          }}
        >
          <p className="body" style={{ textAlign: "center" }}>
            Congratulation
          </p>
          <p className="heading" style={{ textAlign: "center" }}>
            You have successfully subscribed to{" "}
            <span className="primary">{decodeBase64(plan as string)}</span>
          </p>

          <Link to="/" style={{ width: "fit-content" }}>
            <button className="large-primary-btn">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  columnGap: "0.25rem",
                }}
              >
                Go to Dashboard
                <span
                  className="material-symbols-outlined"
                  style={{ fontWeight: "bold" }}
                >
                  arrow_forward
                </span>
              </div>
            </button>
          </Link>

          {/* <p className="body textSecondary" style={{ textAlign: "center" }}>
            Server Error
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Success;
