import React from "react";
import "./customplancard.css";

const Index = () => {
  const handleOpenNewTab = () => {
    window.open("https://www.satoplayer.com/contact-us", "_blank");
  };

  return (
    <div
      className="plancard-container"
      style={{
        // backgroundColor: "var(--surfaceVariant)",
        border: "1px solid",
        borderColor: "var(--stroke)",
        padding: "2rem",
      }}
    >
      <p className="heading">Custom Plan</p>
      <p
        className="body"
        style={{
          marginTop: "0.5rem",
          color: "var(--textSecondary)",
          fontFamily: "Satoshi-Regular",
        }}
      >
        Want to upload more than 50 videos? Talk to us to get a plan tailored to
        your needs.
      </p>

      <div
        className="plancard-feature"
        style={{ marginTop: "3rem", paddingLeft: "1rem" }}
      ></div>

      <div style={{ width: "100%", marginTop: "2rem" }}>
        <button
          className={"large-secondary-btn"}
          style={{
            width: "100%",
          }}
          onClick={handleOpenNewTab}
        >
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export default Index;
