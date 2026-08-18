import satoSvg from "../../assets/sato.svg";

const SatoLogo = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          width: "max-content",
        }}
      >
        <div
          style={{
            width: "4rem",
            height: "4rem",
          }}
        >
          <img
            src={satoSvg}
            alt="no image found"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SatoLogo;
