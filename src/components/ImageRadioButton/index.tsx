import Premium from "../PremiumIcon";
import halcyonImg from "../../assets/images/halcyon.png";
import modernaImg from "../../assets/images/moderna.png";
import prosperImg from "../../assets/images/prosper.png";
import sphinxImg from "../../assets/images/sphinx.png";

type ImageRadioGroupProps = {
  value: string;
  onChange: (value: "halcyon" | "moderna" | "sphinx" | "prosper") => void;
  name: string;
  handleSaveButton?: () => void;
  activePlan?: any;
};

const ImageRadioGroup = ({
  value,
  onChange,
  name = "image-radio",
  handleSaveButton,
  activePlan,
}: ImageRadioGroupProps) => {
  const templateData = ["halcyon", "moderna", "sphinx", "prosper"] as const;
  const imageMap: Record<string, string> = {
    halcyon: halcyonImg,
    moderna: modernaImg,
    sphinx: sphinxImg,
    prosper: prosperImg,
  };

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
        {templateData.map((opt) => (
          <label
            key={opt}
            onClick={(e) => {
              if (
                !activePlan?.metadata?.premium_features?.layoutConfig?.name &&
                opt !== "halcyon"
              ) {
                e.preventDefault();
                window.open(
                  "https://app.satoplayer.com/plans",
                  "_blank",
                  "noopener,noreferrer",
                );
              }
            }}
            style={{
              position: "relative",
              cursor: "pointer",
              border:
                value === opt
                  ? "1px solid var(--primary)"
                  : "1px solid transparent",
              boxShadow:
                value === opt ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
              borderRadius: "0.5rem",
              padding: "0.25rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {!activePlan?.metadata?.premium_features?.layoutConfig?.name &&
              opt !== "halcyon" && (
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
              value={opt}
              checked={value === opt}
              disabled={
                !activePlan?.metadata?.premium_features?.layoutConfig?.name &&
                opt !== "halcyon"
              }
              onChange={() => {
                if (
                  !activePlan?.metadata?.premium_features?.layoutConfig?.name &&
                  opt !== "halcyon"
                )
                  return;
                onChange(opt);
                handleSaveButton && handleSaveButton();
              }}
              style={{
                display: "none",
              }}
            />

            <img
              src={imageMap[opt]}
              alt={opt}
              loading="lazy"
              style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "cover",
                borderRadius: "6px",
                display: "block",
              }}
            />

            <p
              className="label"
              style={{
                marginTop: "1rem",
              }}
            >
              {opt.toUpperCase()}
            </p>
          </label>
        ))}
      </div>
    </>
  );
};

export default ImageRadioGroup;
