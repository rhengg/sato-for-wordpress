import React from "react";
import Premium from "../PremiumIcon";
import { useNavigate } from "react-router-dom";

type ImageRadioGroupProps = {
  options: any[];
  value: string;
  onChange: (value: "halcyon" | "moderna" | "sphinx" | "prosper") => void;
  name: string;
  handleSaveButton?: () => void;
  activePlan?: any;
};

const ImageRadioGroup = ({
  options = [],
  value,
  onChange,
  name = "image-radio",
  handleSaveButton,
  activePlan,
}: ImageRadioGroupProps) => {
  const navigator = useNavigate();

  return (
    <>
      <style>
        {`
    .templateGrid{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      width: 100%;
      max-height: calc((220px) * 2);
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .templateGrid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 528px) {
      .templateGrid {
        grid-template-columns: 1fr;
        height: auto;
      }
    }
  `}
      </style>

      <div className="templateGrid">
        {options.map((opt) => (
          <label
            key={opt.name}
            // onClick={(e) => {
            //   if (activePlan?.amount === 0 && opt.name !== "halcyon") {
            //     e.preventDefault(); // prevent radio selection
            //     navigator("/plans");
            //   }
            // }}
            onClick={(e) => {
              if (
                !activePlan?.metadata?.premium_features?.layoutConfig?.name &&
                opt.name !== "halcyon"
              ) {
                e.preventDefault(); // prevent radio selection
                window.open("/plans", "_blank");
              }
            }}
            style={{
              position: "relative",
              cursor: "pointer",
              border:
                value === opt.name
                  ? "1px solid var(--primary)"
                  : "1px solid transparent",
              boxShadow:
                value === opt.name ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
              borderRadius: "0.5rem",
              padding: "0.25rem",
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!activePlan?.metadata?.premium_features?.layoutConfig?.name &&
              opt.name !== "halcyon" && (
                <div
                  style={{
                    position: "absolute",
                    top: "5%",
                    right: "3%",
                  }}
                >
                  <Premium />
                </div>
              )}
            <input
              type="radio"
              name={name}
              value={opt.name}
              checked={value === opt.name}
              disabled={
                !activePlan?.metadata?.premium_features?.layoutConfig?.name &&
                opt.name !== "halcyon"
              }
              // onChange={() => {
              //   (onChange(opt.name), handleSaveButton && handleSaveButton());
              // }}
              onChange={() => {
                if (
                  !activePlan?.metadata?.premium_features?.layoutConfig?.name &&
                  opt.name !== "halcyon"
                )
                  return;
                onChange(opt.name);
                handleSaveButton && handleSaveButton();
              }}
              style={{
                display: "none",
              }}
            />

            <img
              src={opt.img}
              alt={opt.label}
              loading="lazy"
              style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "cover",
                borderRadius: "6px",
                display: "block",
                // cursor:
                //   activePlan?.amount === 0 && opt.name !== "halcyon"
                //     ? "not-allowed"
                //     : "pointer",
              }}
            />

            <p
              className="label"
              style={{
                marginTop: "1rem",
              }}
            >
              {opt.label}
            </p>
          </label>
        ))}
      </div>
    </>
  );
};

export default ImageRadioGroup;
