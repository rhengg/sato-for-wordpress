import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <>
      {/* Mobile styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .nf-grid {
              grid-template-columns: 1fr !important;
              height: auto !important;
            }

            .nf-left {
              border-right: none !important;
              padding-bottom: 1.5rem;
            }
          }
        `}
      </style>

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
          className="nf-grid"
          style={{
            maxWidth: 1100,
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            columnGap: "2rem",
          }}
        >
          {/* Illustration */}
          <div
            className="nf-left"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRight: "1px solid var(--stroke)",
            }}
          >
            <img
              src={"/Tv404Svg.svg"}
              alt="404 Illustration"
              style={{ width: "100%", maxWidth: 380 }}
            />
          </div>

          {/* Text Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "center",
              paddingLeft: "1rem",
            }}
          >
            <p className="heading">Opps!</p>

            <p className="body">
              We couldn’t find the page you are looking for
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
                  <span
                    className="material-symbols-outlined"
                    style={{ fontWeight: "bold" }}
                  >
                    arrow_back
                  </span>
                  Back Home
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
