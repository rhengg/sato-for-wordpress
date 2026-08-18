import "./error.css";

type ErrorProps = {
  errorMessage: string;
};

const Error = (props: ErrorProps) => {
  const { errorMessage } = props;
  return (
    <div className="error-main">
      <div
        style={{
          padding: "1rem",
          borderRadius: "0.5rem",
          background: "var(--surfaceVariant)",
        }}
      >
        <p className="subtitle-two">{errorMessage}</p>
      </div>
    </div>
  );
};

export default Error;
