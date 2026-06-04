import React from "react";
import Error from "../components/Error";
import { decodeBase64 } from "../utils/base64";

const Error500 = () => {
  const params = new URLSearchParams(window.location.search);
  const msg = params.get("m");

  return (
    // <Error errorMessage={decodeBase64(msg as string) || 'Internal Server Error'} />
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        {/* Illustration */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/Error500.svg"
            alt="500 Illustration"
            style={{
              width: "100%",
              maxWidth: 480,
              display: "block",
            }}
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
          <p className="heading">500</p>

          <p className="body" style={{ textAlign: "center" }}>
            {decodeBase64(msg || "") ||
              "Sorry, something went technically wrong"}
          </p>

          {/* <p className="body textSecondary" style={{ textAlign: "center" }}>
            Server Error
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Error500;
