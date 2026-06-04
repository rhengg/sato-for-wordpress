import React from "react";
import { useNavigate } from "react-router-dom";

const Failed = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "2rem 4rem" }}>
      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="payment-error-container">
          <p className="subtitle-one">Payment Failed</p>
          <p className="body">Could not complete subscription.</p>
          <p className="body">Please contact hello@satoplayer.com with a screenshot of the transaction.</p>
          <p className="body">If your money was deducted, it will be refunded to you in 5-7 working days.</p>
          <button
            className="large-secondary-btn"
            style={{
              width: "100%",
            }}
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
};

export default Failed;
